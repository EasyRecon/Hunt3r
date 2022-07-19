class Admin::ProvidersController < ApplicationController
  before_action :authenticate_user, :admin?
  before_action :set_provider, only: %i[update destroy]

  # GET /admin/providers
  def index
    @providers = Provider.all

    render status: 200, template: 'admin/providers/index'
  end

  # POST /admin/providers
  def create
    providers_params = get_provider_params
    @provider = Provider.create(providers_params)

    unless ssh_key_valid?(@provider) && provider_is_valid?(providers_params)
      @provider.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.invalid_informations'), data: nil }
    end

    unless @provider.save
      @provider.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.already_present'), data: nil }
    end

    render status: 200, json: { message: I18n.t('success.controllers.admin.providers.created'), data: nil }
  end

  # PATCH /admin/providers
  def update
    return render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.unknown'), data: nil } if @provider.nil?

    providers_params = get_provider_params

    if @provider.infos['ssh_key'] && !ssh_key_valid?(@provider)
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.invalid_informations'), data: nil }
    end

    unless provider_is_valid?(providers_params)
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.invalid_informations'), data: nil }
    end

    unless @provider.update(providers_params)
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.invalid_informations'), data: nil }
    end

    render status: 200, json: { message: I18n.t('success.controllers.admin.providers.updated') }
  end

  # DELETE /admin/providers/:name
  def destroy
    if @provider.nil?
      render status: 422, json: { message: I18n.t('errors.controllers.admin.providers.unknown') }
    else
      @provider.destroy
      render status: 200, json: { message: I18n.t('success.controllers.admin.providers.deleted') }
    end
  end
end

private

def get_provider_params
  params.require(:provider).permit(
    :name, infos: %i[access_key secret_key organization_id project_id region zone ssh_key]
  )
end

def set_provider
  return @provider if @provider

  name = if params[:name]
           params[:name]
         elsif params[:provider]
           params[:provider][:name]
         end

  @provider = Provider.find_by_name(name)
end

def provider_is_valid?(providers_params)
  case providers_params[:name]
  when 'scaleway'
    path = '/root/.config/scw/config.yaml'
    dir = File.dirname(path)
    FileUtils.mkdir_p(dir) unless Dir.exist?(dir)

    scw_config = <<~HEREDOC
      access_key: #{providers_params[:infos][:access_key]}
      secret_key: #{providers_params[:infos][:secret_key]}
      default_organization_id: #{providers_params[:infos][:organization_id]}
      default_project_id: #{providers_params[:infos][:project_id]}
      default_region: #{providers_params[:infos][:region]}
      default_zone: #{providers_params[:infos][:zone]}
    HEREDOC

    File.write(path, scw_config)

    check_config = `scw instance server list -o json`
    valid = !check_config.empty?
  when 'aws'
    path = '/root/.aws/config'
    dir = File.dirname(path)
    FileUtils.mkdir_p(dir) unless Dir.exist?(dir)

    aws_config = <<~HEREDOC
      [default]
      region = #{providers_params[:infos][:region]}
      output = json
    HEREDOC

    File.write(path, aws_config)

    path = File.join(`echo $HOME`.strip, '/.aws/credentials')
    dir = File.dirname(path)
    FileUtils.mkdir_p(dir) unless Dir.exist?(dir)

    aws_credentials = <<~HEREDOC
      [default]
      aws_access_key_id = #{providers_params[:infos][:access_key]}
      aws_secret_access_key = #{providers_params[:infos][:secret_key]}
    HEREDOC

    File.write(path, aws_credentials)

    check_config = `aws ec2 describe-instances`
    valid = !check_config.empty?
  else
    valid = false
  end

  valid
end

def ssh_key_valid?(provider)
  return false unless provider.infos['ssh_key']

  path = "/root/.ssh/#{provider.name}_id_rsa"
  dir = File.dirname(path)
  FileUtils.mkdir_p(dir) unless Dir.exist?(dir)

  ssh_key = Base64.decode64(provider.infos['ssh_key'])
  return false unless ssh_key.match?(/-----BEGIN OPENSSH PRIVATE KEY-----.*-----END OPENSSH PRIVATE KEY-----/m)

  ssh_key += "\n" unless ssh_key.end_with?("\n")

  File.write(path, ssh_key, mode: 'w+')
  File.chmod(0600, path)

  true
end
