class ScansController < ApplicationController
  before_action :authenticate_user, except: %i[update_outside]

  # GET /scans
  def index
    @scans = Scan.all

    render status: 200, template: 'scans/index'
  end

  # GET /scans/model
  def model
    render status: 200, template: 'scans/model'
  end

  # POST /scans
  # TODO : Refactor all this method
  def create
    scan_infos = params.require(:scan).permit(
      :domain, :meshs, :type_scan, :instance_type, :provider, :notifs, :active_recon, :intel, :leak, :nuclei,
      :all_templates, :custom_interactsh, :permutation, :gau, nuclei_severity: [], custom_templates: []
    )

    hunt3r_token = Tool.find_by(name: 'hunt3r_token')
    if hunt3r_token.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.scans.hunt3r_token'), data: nil }
    end
    cmd = "ruby scan.rb --hunt3r-token #{hunt3r_token.infos['api_key']} --url #{ENV['APP_URL']}"

    if Provider.find_by(name: scan_infos[:provider]).nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.unknown'), data: nil }
    end

    scan = Scan.create(scan_infos)
    unless scan.valid? || scan.type_scan != 'recon' || scan.type_scan != 'nuclei'
      scan.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.scans.invalid'), data: nil }
    end
    cmd += " --scan-id #{scan.id} --type-scan #{scan.type_scan} -d #{scan.domain}"

    slack_webhook = Tool.find_by(name: 'slack')
    if scan.notifs && slack_webhook.nil?
      scan.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.scans.missing_webhook'), data: nil }
    end

    if scan.type_scan == 'recon'
      unless File.exist?(File.join(scan_config_files, 'amass/config.ini'))
        return render status: 422, json: { message: I18n.t('errors.controllers.scans.missing_amass'), data: nil }
      end

      # If launched from the scope page we remove the wildcard
      scan.domain.gsub!('*.', '')

      if scan.leak
        dehashed = Tool.find_by(name: 'dehashed')
        if dehashed.nil?
          scan.destroy
          return render status: 422, json: { message: I18n.t('errors.controllers.scans.dehashed_credentials'), data: nil }
        end

        cmd += " --leak true --dehashed-username #{dehashed[:infos]['user']} --dehashed-token #{dehashed[:infos]['api_key']}"
      end

      if scan.intel
        c99 = Tool.find_by(name: 'c99')&.infos
        whoxy = Tool.find_by(name: 'whoxy')&.infos

        if c99.nil? || whoxy.nil?
          scan.destroy
          return render status: 422, json: { message: I18n.t('errors.controllers.scans.missing_intel'), data: nil }
        end

        cmd += " --intel true --c99-token #{c99['api_key']} --whoxy-token #{whoxy['api_key']}"
      end

      if scan.meshs
        meshs = Mesh.all.select(:url, :token)

        if meshs.empty?
          scan.destroy
          return render status: 422, json: { message: I18n.t('errors.controllers.scans.missing_meshs'), data: nil }
        end

        cmd += " --meshs #{meshs.to_json}"
      end

      cmd += ' --gau true' if scan.gau
      cmd += ' --active-amass true' if scan.active_recon
    end

    if scan.nuclei || scan.type_scan == 'nuclei'
      cmd += " --nuclei #{scan.nuclei}"

      unless (scan.custom_templates && !scan.custom_templates.empty?) || scan.all_templates
        scan.destroy
        return render status: 422, json: { message: I18n.t('errors.controllers.scans.no_nuclei_templates'), data: nil }
      end

      if scan.nuclei_severity && !scan.nuclei_severity.empty?
        severity = scan.nuclei_severity.join(',')
        cmd += " --nuclei-severity #{severity}"
      end

      if scan.custom_interactsh
        interactsh = Tool.find_by(name: 'interactsh')
        if interactsh.nil?
          scan.destroy
          return render status: 422, json: { message: I18n.t('errors.controllers.scans.missing_interactsh'), data: nil }
        end

        cmd += " --interactsh-url #{interactsh[:url]}"
        cmd += " --interactsh-token #{interactsh[:api_key]}" if interactsh[:api_key]
      end

      cmd += ' --nuclei-all-templates true' if scan.all_templates

      if scan.custom_templates && !scan.custom_templates.empty?
        scan.custom_templates.each do |template|
          template = "#{template}.yaml" unless template.end_with?('.yaml')
          next if File.exist?("#{nuclei_templates_path}/#{template.gsub('..', '')}")

          scan.destroy
          return render status: 422, json: { message: I18n.t('errors.controllers.scans.missing_template'), data: nil }
        end

        templates = scan.custom_templates.join(',')
        cmd += " --nuclei-custom-templates #{templates}"
      end

      if scan.type_scan == 'nuclei'
        subdomains = if scan.domain == '*'
                       Subdomain.all
                     else
                       Domain.find_by(name: scan.domain)&.subdomain
                     end

        if subdomains.nil? || subdomains.empty?
          scan.destroy
          return render status: 422, json: { message: I18n.t('errors.controllers.scans.empty_subdomains'), data: nil }
        end

        subdomains_urls = []
        subdomains.each do |subdomain|
          subdomains_urls << subdomain.url
        end

        File.open(domains_file, 'w+') do |f|
          f.puts(subdomains_urls)
        end
      end
    end

    case scan.provider
    when 'scaleway'
      # Force default value to DEV1-S
      scan.update(instance_type: 'DEV1-S') unless scan[:instance_type]

      cmd_output = launch_scaleway_server(scan.instance_type)

      begin
        cmd_output_json = JSON.parse(cmd_output)
      rescue JSON::ParserError
        scan.destroy
        return render status: 500, json: { message: I18n.t('errors.controllers.scans.parse_error'), data: nil }
      end

      server_infos = {
        uid: cmd_output_json['id'],
        name: cmd_output_json['name'],
        ip: cmd_output_json['public_ip']['address'],
        state: 'Launched',
        scan_id: scan.id
      }

      scan.update(state: 'Deploy In Progress')
    else
      return render status: 422, json: { message: I18n.t('errors.controllers.scans.unknown_provider'), data: nil }
    end

    server = Server.create(server_infos)
    cmd += " --server-uid #{server[:uid]}"

    Domain.create(name: scan.domain, scan_id: scan.id) if scan.type_scan == 'recon' && Domain.find_by(name: scan.domain).nil?
    Scope.where('scope LIKE ?', "%.#{scan.domain}").first&.update(last_scan: Time.now) unless scan.type_scan == 'nuclei'

    Thread.start do
      puts cmd

      # Sleep until the server starts and install the necessary tools
      p '------- SLEEP 360'
      sleep(360)

      begin
        Net::SCP.start(server.ip, 'root', keys: "/root/.ssh/#{scan.provider}_id_rsa") do |scp|
          # upload a file to a remote server
          scp.upload! scan_config_files, '/tmp', recursive: true
          scp.upload! scan_tools_files,'/tmp', recursive: true
          scp.upload! domains_file, '/tmp' if scan.type_scan == 'nuclei'
        end

        Net::SSH.start(server.ip, 'root', keys: "/root/.ssh/#{scan.provider}_id_rsa") do |ssh|
          p '----- DEBUG'
          puts 'SSH OK'
          puts ssh.exec!('whoami')

          #ssh.exec!("screen -dm -S Scan #{cmd}")
        end
      rescue Net::SSH::AuthenticationFailed
        server_delete(server, 'Stopped')
        scan.destroy

        Notification.create(type_message: 'danger', message: 'Unable to run a scan, check your SSH key')
      end
    end

    render status: 200, json: { message: I18n.t('success.controllers.scans.launched'), data: nil }
  end

  # PATCH /scans
  # Accessible from outside
  def update_outside
    scan_params = params.require(:scan).permit(:token, :scan_id, :state)

    unless hunt3r_token_valid?(scan_params[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.scans.invalid'), data: nil }
    end

    scan = Scan.find_by(id: scan_params[:scan_id])
    return if scan.nil?

    scan.update(state: scan_params[:state])
  end

  private

  def domains_file
    File.join(Rails.root, 'storage', 'domains.txt')
  end

  def scan_config_files
    File.join(Rails.root, 'storage', 'configs', 'tools')
  end

  def scan_tools_files
    File.join(Rails.root, 'storage', 'tools')
  end

  def cloud_init_file
    File.join(Rails.root, 'storage', 'configs', 'cloud-init.yml')
  end

  def nuclei_templates_path
    File.join(Rails.root, 'storage', 'configs', 'tools', 'nuclei', 'templates')
  end

  def random_name
    (0...12).map { rand(97..122).chr }.join
  end

  def launch_scaleway_server(instance_type)
    `scw instance server create type=#{instance_type} image=ubuntu_jammy name=scw-hunt3r-#{random_name} cloud-init=@#{cloud_init_file} -o json`.strip
  end
end
