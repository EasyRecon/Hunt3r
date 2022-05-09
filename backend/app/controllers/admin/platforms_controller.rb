require 'get_platform_jwt'

class Admin::PlatformsController < ApplicationController
  include(GetPlatformJwt)

  before_action :authenticate_user, :admin?
  before_action :set_platform, only: %i[update destroy]

  # GET /admin/platforms
  def index
    @platforms = Platform.all

    render status: 200, template: 'admin/platforms/index'
  end

  # POST /admin/platforms
  def create
    platform_params = get_platform_params
    platform_params['otp']&.gsub!(/\s+/, '')

    @platform = Platform.create(platform_params)

    unless @platform.save
      @platform.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.already_present'), data: nil }
    end

    unless platform_is_valid?(@platform)
      @platform.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.invalid_informations'), data: nil }
    end

    @platform.hunter_username = get_hunter_username(@platform)
    @platform.save

    render status: 200, json: { message: I18n.t('success.controllers.admin.platforms.created'), data: nil }
  end

  # PATCH /admin/platforms
  def update
    return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.unknown'), data: nil } if @platform.nil?

    platform_params = get_platform_params
    platform_params['otp']&.gsub!(/\s+/, '')

    unless @platform.update(platform_params)
      @platform.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.invalid_informations'), data: nil }
    end

    unless platform_is_valid?(@platform)
      @platform.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.invalid_informations'), data: nil }
    end

    render status: 200, json: { message: I18n.t('success.controllers.admin.platforms.updated'), data: nil }
  end

  # DELETE /admin/platforms/:name
  def destroy
    return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.unknown'), data: nil } if @platform.nil?

    @platform.destroy
    render status: 200, json: { message: I18n.t('success.controllers.admin.platforms.deleted'), data: nil }
  end
end

private

def set_platform
  return @platform if @platform

  name = if params[:name]
           params[:name]
         elsif params[:platform]
           params[:platform][:name]
         end

  @platform = Platform.find_by_name(name)
end

def get_platform_params
  params.require(:platform).permit(
    :name, :email, :password, :hunter_username, :otp
  )
end

def platform_is_valid?(platform)
  valid = if platform.name == 'hackerone'
            validate_hackerone(platform)
          else
            get_platform_jwt(platform)
          end

  true if valid
end

def get_hunter_username(platform)
  case platform.name
  when 'yeswehack'
    get_ywh_username(platform.jwt)
  when 'intigriti'
    get_intigriti_username(platform.jwt)
  when 'hackerone'
    platform.email
  else
    nil
  end
end

def validate_hackerone(platform)
  # There is no JWT on hackerone, use this method to make sure the login is valid

  platform.jwt = platform.password
  platform.save

  request = Typhoeus::Request.new(
    'https://api.hackerone.com/v1/hackers/me/reports',
    userpwd: "#{platform.email}:#{platform.jwt}",
    headers: { 'Accept': 'application/json' }
  )
  request.run
  response = request.response

  response.code == 200
end

def get_ywh_username(jwt)
  request = Typhoeus::Request.new(
    'https://api.yeswehack.com/user',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer #{jwt}" }
  )
  request.run
  response = request.response
  return unless response&.code == 200

  JSON.parse(response.body)['username']
end

def get_intigriti_username(jwt)
  request = Typhoeus::Request.new(
    'https://api.intigriti.com/user/user',
    headers: { Authorization: "Bearer #{jwt}" }
  )
  request.run
  response = request.response
  return unless response&.code == 200

  JSON.parse(response.body)['userName']
end
