require 'platforms'

class ProgramsController < ApplicationController
  include(Platforms)

  before_action :authenticate_user

  # GET /programs
  def index
    @programs = params[:name] ? Platform.find_by(name: params[:name])&.programs : Program.all
    @programs&.order(id: :asc)&.filtered(query_params)

    render status: 200, template: 'programs/index'
  end

  # PATCH /programs
  def update
    platforms = Platform.all
    if platforms.empty?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.empty'), data: nil }
    end

    rate_limited = launch_sync(platforms)
    if rate_limited.compact.empty?
      render status: 200, json: { message: I18n.t('success.controllers.programs.sync_in_progress'), data: nil }
    else
      render status: 429, json: { message: I18n.t('errors.controllers.programs.rate_limited'), data: rate_limited }
    end
  end
end

private

def launch_sync(platforms)
  rate_limited = []
  platforms.each do |platform|
    rate_limited << rate_limited?(platform)
    next if rate_limited.include?(platform.name)

    update_programs(platform)
    platform.programs.last.update(updated_at: Time.now)
  end

  rate_limited
end

# In order to avoid that several refreshes are launched at the same time so as not to overload the platform's API
def rate_limited?(platform)
  return unless platform.programs.last && Time.now - platform.programs.last.updated_at < 1800

  platform.name
end

def query_params
  params[:program] || ''
end
