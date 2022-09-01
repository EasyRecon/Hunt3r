class ScansController < ApplicationController
  before_action :authenticate_user, except: %i[update_outside]

  # GET /scans
  def index
    @scans = Scan.all.order(id: :desc)

    render status: 200, template: 'scans/index'
  end

  # GET /scans/model
  def model
    render status: 200, template: 'scans/model'
  end

  # POST /scans
  def create
    scan_infos = params.require(:scan).permit(
      :domain, :meshs, :type_scan, :instance_type, :provider, :notifs, :active_recon, :intel, :leak, :nuclei,
      :all_templates, :custom_interactsh, :permutation, :gau, excludes: [], nuclei_severity: [], custom_templates: []
    )

    if Provider.find_by(name: scan_infos[:provider]).nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.unknown'), data: nil }
    end

    scan = Scan.create(scan_infos)
    unless scan.valid? && (scan.type_scan != 'recon' || scan.type_scan != 'nuclei')
      scan.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.scans.invalid'), data: nil }
    end

    # Needed for the last scan update
    base_domain = scan.domain.dup
    scan_cmd = build_scan_cmd(scan)
    if scan_cmd[:errors]
      scan.destroy
      return render status: 422, json: { message: I18n.t("errors.controllers.scans.#{scan_cmd[:errors]}"), data: nil }
    end

    server_infos = launch_server(scan)
    if server_infos[:error]
      scan.destroy
      return render status: 422, json: { message: I18n.t("errors.controllers.scans.#{server_infos[:error]}"), data: nil }
    end

    server = Server.create(server_infos[:infos])
    scan_cmd[:cmd] += " --server-uid #{server[:uid]}"

    launch_scan(scan_cmd[:cmd], scan, server, base_domain)

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

  def build_scan_cmd(scan)
    scan_cmd = { cmd: 'ruby /tmp/tools/scan.rb' }
    hunt3r_token = Tool.find_by(name: 'hunt3r_token')&.infos
    scan_cmd[:errors] = 'hunt3r_token' if hunt3r_token.nil?

    hunt3r_url = request.protocol + request.host_with_port
    scan_cmd[:cmd] += " --hunt3r-token #{hunt3r_token['api_key']} --url #{hunt3r_url}" if hunt3r_token

    # If launched from the scope page we remove the wildcard and the https://
    scan.domain.gsub!('*.', '')
    scan.domain.gsub!(%r{^https?://}, '')

    scan_cmd[:cmd] += " --scan-id #{scan.id} --type-scan #{scan.type_scan} -d #{scan.domain}"

    slack_webhook = Tool.find_by(name: 'slack')&.infos
    if scan.notifs && slack_webhook.nil?
      scan_cmd[:errors] = 'missing_webhook'
    else
      scan_cmd[:cmd] += " --slack #{slack_webhook['webhook']}"
    end

    scan_cmd = build_recon_scan_cmd(scan, scan_cmd) if scan.type_scan == 'recon'
    scan_cmd = build_nuclei_scan_cmd(scan, scan_cmd) if scan.nuclei || scan.type_scan == 'nuclei'

    scan_cmd[:cmd] += " --concurrency #{scan.concurrency}"

    scan_cmd
  end

  def build_recon_scan_cmd(scan, scan_cmd)
    scan_cmd[:errors] = 'missing_amass' unless File.exist?(File.join(scan_config_files, 'amass/config.ini'))

    scan_cmd = build_recon_scan_leak_cmd(scan_cmd) if scan.leak
    scan_cmd = build_recon_scan_intel_cmd(scan_cmd) if scan.intel

    if scan.meshs
      meshs = Mesh.all.select(:url, :token)
      if meshs.empty?
        scan_cmd[:errors] = 'missings_meshs'
      else
        scan_cmd[:cmd] += ' --meshs true'
        File.write(meshs_file, meshs.to_json(except: :id), mode: 'w+')
      end
    end

    scan_cmd[:cmd] += ' --permutation true' if scan.permutation
    scan_cmd[:cmd] += ' --gau true' if scan.gau
    scan_cmd[:cmd] += ' --amass-active true' if scan.active_recon
    scan_cmd[:cmd] += " --excludes #{scan.excludes.join(',')}" unless scan.excludes.nil? || scan.excludes.empty?
    scan_cmd
  end

  def build_recon_scan_leak_cmd(scan_cmd)
    dehashed = Tool.find_by(name: 'dehashed')
    if dehashed.nil?
      scan_cmd[:errors] = 'dehashed_credentials'
      return scan_cmd
    end

    scan_cmd[:cmd] += " --leak true --dehashed-username #{dehashed[:infos]['user']}"
    scan_cmd[:cmd] += " --dehashed-token #{dehashed[:infos]['api_key']}"
    scan_cmd
  end

  def build_recon_scan_intel_cmd(scan_cmd)
    c99 = Tool.find_by(name: 'c99')&.infos
    whoxy = Tool.find_by(name: 'whoxy')&.infos
    if c99.nil? || whoxy.nil?
      scan_cmd[:errors] = 'missing_intel'
      return scan_cmd
    end

    scan_cmd[:cmd] += " --intel true --c99-token #{c99['api_key']} --whoxy-token #{whoxy['api_key']}"
    scan_cmd
  end

  def build_nuclei_scan_cmd(scan, scan_cmd)
    scan_cmd[:cmd] += " --nuclei #{scan.nuclei}"

    unless (scan.custom_templates && !scan.custom_templates.empty?) || scan.all_templates
      scan_cmd[:errors] = 'no_nuclei_templates'
    end

    if scan.nuclei_severity && !scan.nuclei_severity.empty?
      scan_cmd[:cmd] += " --nuclei-severity #{scan.nuclei_severity.join(',')}"
    end

    if scan.custom_interactsh
      interactsh = Tool.find_by(name: 'interactsh')
      if interactsh.nil?
        scan_cmd[:errors] = 'missing_interactsh'
      else
        scan_cmd[:cmd] += " --interactsh-url #{interactsh[:url]}"
        scan_cmd[:cmd] += " --interactsh-token #{interactsh[:api_key]}" if interactsh[:api_key]
      end
    end

    scan_cmd[:cmd] += ' --nuclei-all-templates true' if scan.all_templates

    if scan.custom_templates && !scan.custom_templates.empty?
      scan.custom_templates.each do |template|
        template = "#{template}.yaml" unless template.end_with?('.yaml')
        next if File.exist?("#{nuclei_templates_path}/#{template.gsub('..', '')}")

        scan_cmd[:errors] = 'missing_template'
      end

      templates = scan.custom_templates.join(',')
      scan_cmd[:cmd] += " --nuclei-custom-templates #{templates}"
    end

    return scan_cmd unless scan.type_scan == 'nuclei'

    subdomains = if scan.domain == '*'
                   Subdomain.all
                 else
                   Domain.find_by(name: scan.domain)&.subdomain
                 end

    if subdomains.nil? || subdomains.empty?
      scan_cmd[:errors] = 'empty_subdomains'
    else
      subdomains_urls = []
      subdomains.each do |subdomain|
        subdomains_urls << subdomain.url
      end

      File.open(domains_file, 'w+') do |f|
        f.puts(subdomains_urls)
      end
    end

    scan_cmd
  end

  def launch_server(scan)
    server_infos = {}

    unless scan.provider == 'scaleway' || scan.provider == 'aws'
      server_infos[:error] = 'unknown_provider'
      return server_infos
    end

    cmd_output = if scan.provider == 'scaleway'
                   # Force default value to DEV1-S
                   scan.update(instance_type: 'DEV1-S') unless scan[:instance_type]
                   launch_scaleway_server(scan)
                 else
                   # Force default value to t2.small
                   scan.update(instance_type: 't2.small') unless scan[:instance_type]
                   launch_aws_server(scan)
                 end

    begin
      cmd_output_json = JSON.parse(cmd_output)
    rescue JSON::ParserError
      server_infos[:error] = 'parse_error'
      return server_infos
    end

    scan.update(state: 'Deploy In Progress')

    case scan.provider
    when 'scaleway'
      server_infos[:infos] = {
        uid: cmd_output_json['id'],
        name: cmd_output_json['name'],
        ip: cmd_output_json['public_ip']['address'],
        state: 'Launched',
        scan_id: scan.id
      }
    when 'aws'
      server_infos[:infos] = {
        uid: cmd_output_json['Instances'][0]['InstanceId'],
        name: cmd_output_json['Instances'][0]['Tags'][0]['Value'],
        state: 'Launched',
        scan_id: scan.id
      }

      sleep 1

      cmd_output = `aws ec2 describe-instances --instance-ids #{server_infos[:infos][:uid]}`
      json_data = JSON.parse(cmd_output)
      server_infos[:infos][:ip] = json_data['Reservations'][0]['Instances'][0]['PublicIpAddress']
    end

    server_infos
  end

  def launch_scan(cmd, scan, server, base_domain)
    if scan.type_scan == 'recon'
      domain = Domain.find_by(name: scan.domain)
      domain.nil? ? Domain.create(name: scan.domain) : domain.update(updated_at: Time.now)
    end

    Scope.find_by(scope: base_domain)&.update(last_scan: Time.now) unless scan.type_scan == 'nuclei'
    Thread.start do
      # Sleep until the server starts and install the necessary tools
      sleep(300)

      begin
        Net::SCP.start(server.ip, 'root', keys: "/root/.ssh/#{scan.provider}_id_rsa") do |scp|
          # upload a file to a remote server
          scp.upload! scan_config_files, '/tmp', recursive: true
          scp.upload! scan_tools_files,'/tmp', recursive: true
          scp.upload! meshs_file, '/tmp' if scan.meshs
          scp.upload! domains_file, '/tmp' if scan.type_scan == 'nuclei'
        end

        Net::SSH.start(server.ip, 'root', keys: "/root/.ssh/#{scan.provider}_id_rsa") do |ssh|
          ssh.exec!("screen -dm -S Scan #{cmd}")
        end
      rescue Net::SSH::AuthenticationFailed
        server_delete(server, 'Stopped')
        scan.destroy

        Notification.create(type_message: 'danger', message: 'Unable to run a scan, check your SSH key')
      end
    end
  end

  def domains_file
    File.join(Rails.root, 'storage', 'domains.txt')
  end

  def meshs_file
    File.join(Rails.root, 'storage', 'meshs.txt')
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

  def launch_scaleway_server(scan)
    return unless scan.instance_type_valid?

    `scw instance server create type=#{scan.instance_type} image=ubuntu_jammy name=scw-hunt3r-#{random_name} cloud-init=@#{cloud_init_file} -o json`.strip
  end

  def launch_aws_server(scan)
    return unless scan.instance_type_valid?

    `aws ec2 run-instances --image-id ami-0d75513e7706cf2d9 --count 1 --instance-type #{scan.instance_type} --key-name hunt3r --user-data file://#{cloud_init_file} --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=aws-#{random_name}}]'`
  end

end
