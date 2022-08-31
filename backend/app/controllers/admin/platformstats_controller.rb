require 'platforms'

class Admin::PlatformstatsController < ApplicationController
  include(Platforms)

  before_action :authenticate_user, :admin?
  before_action :set_platform

  # GET /platforms/:name/stats
  def index
    if @platform.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.unknown'), data: nil }
    end

    @reports = @platform&.PlatformStat.filtered(query_params).order(report_date: :desc)

    render status: 200, template: 'admin/platformstats/index'
  end

  # PATCH /platforms/:name/stats
  def update
    platform_stats = @platform.PlatformStat
    # In order to avoid that several refreshes are launched at the same time so as not to overload the platform's API
    if !platform_stats.empty? && (Time.now - platform_stats.last.updated_at) < 1800
      return render status: 429, json: { message: I18n.t('errors.controllers.admin.platformstats.rate_limit'), data: nil }
    end

    @platform.PlatformStat.last.update(updated_at: Time.now) unless platform_stats.empty?
    update_reports(@platform)

    render status: 200, json: { message: I18n.t('success.controllers.admin.platformstats.updated'), data: nil }
  end

  private

  def set_platform
    return @platform if @platform

    @platform = Platform.find_by(name: params[:name])
    if @platform.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.unknown'), data: nil }
    end

    @platform
  end

  def query_params
    query_params = { from: params[:from], to: params[:to] }

    query_params[:from] && query_params[:to] ? query_params : { from: '2014-01-01', to: '2030-12-31' }
  end
end
