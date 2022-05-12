require 'platforms'

class Admin::PlatformsController < ApplicationController
  include(Platforms)

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

    render status: 200, json: { message: I18n.t('success.controllers.admin.platforms.created'), data: nil }
  end

  # PATCH /admin/platforms
  def update
    if @platform.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.unknown'), data: nil }
    end

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
    if @platform.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.unknown'), data: nil }
    end

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
  params.require(:platform).permit(:name, :email, :password, :hunter_username, :otp)
end
