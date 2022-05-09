require 'get_platform_jwt'
require 'platform_sync'

class ProgramsController < ApplicationController
  include(GetPlatformJwt)
  include(PlatformSync)

  before_action :authenticate_user

  # GET /programs
  def index
    if params[:name]
      platform = Platform.find_by_name(params[:name])
      @programs = platform.nil? ? [] : Program.where(platform_id: platform.id).order(id: :asc).filtered(query_params)
    else
      @programs = Program.all
    end

    render status: 200, template: 'programs/index'
  end

  # PATCH /programs
  def update
    platforms = Platform.all
    if platforms.empty?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.empty'), data: nil }
    end

    rate_limited = []
    platforms.each do |platform|
      # In order to avoid that several refreshes are launched at the same time so as not to overload the platform's API
      if platform.program.last && (Time.now - platform.program.last.updated_at) < 1800
        rate_limited << platform.name
        next
      elsif platform.program.last
        platform.program.last.update(updated_at: Time.now)
      end

      case platform.name
      when 'yeswehack'
        Thread.start do
          jwt = get_platform_jwt(platform)
          update_yeswehack_programs(jwt, platform)
        end
      when 'intigriti'
        Thread.start do
          jwt = get_platform_jwt(platform)
          update_intigriti_programs(jwt, platform)
        end
      when 'hackerone'
        Thread.start do
          update_hackerone_programs(platform)
        end
      else
        next
      end
    end

    if rate_limited.empty?
      render status: 200, json: { message: I18n.t('success.controllers.programs.sync_in_progress'), data: nil }
    else
      render status: 429, json: { message: I18n.t('errors.controllers.programs.rate_limited'), data: rate_limited }
    end
  end
end

private

def query_params
  params[:program] || ''
end
