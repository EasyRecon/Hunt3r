require 'get_platform_jwt'

class Admin::PlatformstatsController < ApplicationController
  include(GetPlatformJwt)

  before_action :authenticate_user, :admin?

  # GET /platforms/:name/stats
  def index
    platform = Platform.find_by(name: params[:name])
    @reports = if platform.nil?
                 nil
               else
                 PlatformStat.where(platform_id: platform.id).filtered(query_params).order(report_date: :desc)
               end

    render status: 200, template: 'admin/platformstats/index'
  end

  # PATCH /platforms/:name/stats
  def update
    platform = Platform.find_by_name(params[:name])
    return render status: 422, json: { message: I18n.t('errors.controllers.admin.platforms.unknown'), data: nil } if platform.nil?

    platform_stats = platform.PlatformStat
    # In order to avoid that several refreshes are launched at the same time so as not to overload the platform's API
    if platform_stats && (Time.now - platform_stats.last.updated_at) < 1800
      return render status: 429, json: { message: I18n.t('errors.controllers.admin.platformstats.rate_limit'), data: nil }
    elsif platform_stats
      platform.PlatformStat.last.update(updated_at: Time.now)
    end

    case platform.name
    when 'yeswehack'
      jwt = get_platform_jwt(platform)
      get_yeswehack_user_reports(platform, jwt, false)
      get_yeswehack_user_reports(platform, jwt, true)
    when 'intigriti'
      jwt = get_platform_jwt(platform)
      get_intigriti_reports(platform, jwt)
    when 'hackerone'
      get_hackerone_reports(platform)
    else
      return render status: 422, json: { message: I18n.t('errors.controllers.programs.empty'), data: nil }
    end

    render status: 200, json: { message: I18n.t('success.controllers.admin.platformstats.updated'), data: nil }
  end
end

private

def query_params
  query_params = { from: params[:from], to: params[:to] }

  query_params[:from] || query_params[:to] ? query_params : { from: '2014-01-01', to: '2030-12-31' }
end

def get_hackerone_reports(platform)
  request = Typhoeus::Request.new(
    'https://api.hackerone.com/v1/hackers/me/reports',
    userpwd: "#{platform.email}:#{platform.jwt}",
    headers: { 'Accept': 'application/json' }
  )
  request.run
  response = request.response
  return unless response.code == 200

  response_json = JSON.parse(response.body)
  reports = response_json['data']

  reports.each do |report|

    report_infos = {
      report_id: report['id'],
      report_title: report['attributes']['title'],
      report_date: Date.parse(report['attributes']['created_at']).strftime('%Y-%m-%d'),
      report_status: report['attributes']['state'],
      severity: report['relationships']['severity']['data']['attributes']['rating'],
      currency: 'USD',
      collab: false
    }

    if report['attributes']['bounty_awarded_at']
      report_infos[:reward] = get_hackerone_report_reward(platform, report_infos[:report_id])
    end

    current_report = PlatformStat.find_by(report_id: report_infos[:report_id])
    if current_report.nil?
      report_infos[:platform_id] = platform.id
      PlatformStat.create(report_infos)
    else
      current_report.update(report_infos)
    end
  end
end

def get_hackerone_report_reward(platform, report_id)
  request = Typhoeus::Request.new(
    "https://api.hackerone.com/v1/hackers/reports/#{report_id}",
    userpwd: "#{platform.email}:#{platform.jwt}",
    headers: { 'Accept': 'application/json' }
  )
  request.run
  response = request.response
  return unless response.code == 200

  response_json = JSON.parse(response.body)
  report_activities = response_json['data']['relationships']['activities']['data']

  reward = 0
  report_activities.each do |activity|
    next unless activity['type'] == 'activity-bounty-awarded'

    reward += activity['attributes']['bounty_amount'].to_f
    reward += activity['attributes']['bonus_amount'].to_f
  end

  reward
end

def get_yeswehack_user_reports(platform, jwt, collab, page_id = 1)
  api_url = 'https://api.yeswehack.com/'
  base_url = if collab
               File.join(api_url, "/collaborator/reports?page=#{page_id}")
             else
               File.join(api_url,"/user/reports?page=#{page_id}")
             end

  request = Typhoeus::Request.new(
    base_url,
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer #{jwt}" }
  )
  request.run
  response = request.response
  return unless response&.code == 200

  response_json = JSON.parse(response.body)
  nb_pages = response_json['pagination']['nb_pages']
  reports = response_json['items']

  reports.each do |report|
    report_infos = get_yeswehack_report_infos(jwt, report['id'], collab, platform.hunter_username)

    report_infos[:report_title] = report['title']
    report_infos[:report_status] = report['status']['workflow_state']
    report_infos[:currency] = report['currency']

    current_report = PlatformStat.find_by(report_id: report['local_id'])
    if current_report.nil?
      report_infos[:report_id] = report['local_id']
      report_infos[:platform_id] = platform.id
      report_infos[:report_date] = Date.parse(report['created_at']).strftime('%Y-%m-%d')

      PlatformStat.create(report_infos)
    else
      current_report.update(report_infos)
    end
  end

  return if page_id == nb_pages

  page_id += 1
  get_yeswehack_user_reports(platform, jwt, collab, page_id)
end

def get_yeswehack_report_infos(jwt, report_id, collab, username)
  request = Typhoeus::Request.new(
    "https://api.yeswehack.com/reports/#{report_id}/logs",
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer #{jwt}" }
  )
  request.run
  response = request.response
  return unless response&.code == 200

  response_json = JSON.parse(response.body)['items']

  report_infos = {
    reward: 0,
    collab: collab
  }

  response_json.each do |item|
    next unless item

    report_infos[:severity] = item['old_cvss']['criticity'] unless item['old_cvss']['criticity'].nil?
    report_infos[:severity] = item['new_cvss']['criticity'] unless item['new_cvss']['criticity'].nil?

    report_infos[:collab] = true if item['type'] == 'collaborator-added'
    next unless item['type'] == 'reward' && item['user_rewarded']['username'] == username

    report_infos[:reward] += item['bounty_reward_amount'] / 100.to_f
  end

  report_infos[:severity] = get_yeswehack_report_severity(jwt, report_id) if report_infos[:severity].nil?

  report_infos
end

def get_yeswehack_report_severity(jwt, report_id)
  request = Typhoeus::Request.new(
    "https://api.yeswehack.com/reports/#{report_id}",
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer #{jwt}" }
  )
  request.run
  response = request.response
  return unless response&.code == 200

  JSON.parse(response.body)['criticity']
end

def get_intigriti_reports(platform, jwt)
  request = Typhoeus::Request.new(
    'https://api.intigriti.com/core/researcher/submission',
    headers: { Authorization: "Bearer #{jwt}" }
  )
  request.run
  response = request.response
  return unless response&.code == 200

  reports = JSON.parse(response.body)
  reports.each do |report|
    report_status = report['state']['status']

    case report_status
    when 4..5
      report_status = report['state']['closeReason']
      report_status = case report_status
                      when 1
                        'resolved'
                      when 2
                        'duplicate'
                      when 3
                        'accepted risk'
                      when 4
                        'informative'
                      when 5
                        'out of scope'
                      when 6
                        'spam'
                      when 7
                        'N/A'
                      else
                        'unknow'
                      end
    when 3
      report_status = 'accepted'
    when 2
      report_status = 'triaged'
    when 1
      report_status = 'draft'
    else
      report_status = 'unknow'
    end

    report_data = get_intigriti_report_infos(platform, jwt, report['programId'], report['id'])
    report_data[:report_title] = report['title']
    report_data[:severity] = report['severity']
    report_data[:report_status] = report_status
    report_data[:report_date] = DateTime.strptime(report['createdAt'].to_s, '%s').strftime('%Y-%m-%d')
    report_data[:platform_id] = platform.id
    report_data[:report_id] = report['id']

    current_report = PlatformStat.find_by(report_id: report['id'])
    if current_report.nil?
      PlatformStat.create(report_data)
    else
      current_report.update(report_data)
    end
  end
end

def get_intigriti_report_infos(platform, jwt, program_id, report_id)
  request = Typhoeus::Request.new(
    "https://api.intigriti.com/core/researcher/program/#{program_id}/submission/#{report_id}",
    headers: { Authorization: "Bearer #{jwt}" }
  )

  request.run
  response = request.response
  return unless response&.code == 200

  json_data = JSON.parse(response.body)

  reward = 0
  currency = ''
  json_data['payouts'].each do |payout|
    next unless payout['researcher']['userName'] == platform.hunter_username

    reward += payout['amount']['value']
    currency = payout['amount']['currency']
  end

  collab = json_data['collaborators'].size > 1

  { reward: reward, currency: currency, collab: collab }
end
