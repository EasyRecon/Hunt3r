class YesWeHack
  def self.get_jwt(platform)
    return unless platform.jwt.nil? || (Time.now - platform.updated_at) > 3500

    totp_token = get_totp_token(platform)
    return unless totp_token

    jwt_token = get_jwt_token(platform, totp_token)
    return unless jwt_token

    platform.update(jwt: jwt_token)
    jwt_token
  end

  def self.get_totp_token(platform)
    data = { email: platform.email, password: platform.password }.to_json
    response = api_post_request('https://api.yeswehack.com/login', data)
    return unless response.code == 200

    JSON.parse(response.body)['totp_token']
  end

  def self.get_jwt_token(platform, totp_token)
    totp_code = ROTP::TOTP.new(platform.otp)
    data = { token: totp_token, code: totp_code.now }.to_json
    response = api_post_request('https://api.yeswehack.com/account/totp', data)
    return unless response.code == 200

    JSON.parse(response.body)['token']
  end

  def self.get_username(platform)
    get_jwt(platform)

    response = api_get_request(platform, 'https://api.yeswehack.com/user')
    return unless response&.code == 200

    JSON.parse(response.body)['username']
  end

  def self.update_programs(platform, page_id = 1)
    get_jwt(platform)

    programs_infos = get_programs_infos(platform, page_id)
    return if programs_infos.nil?

    parse_programs(programs_infos[:programs], platform)
    update_programs(platform, page_id + 1) if page_id + 1 <= programs_infos[:nb_pages]
  end

  def self.get_programs_infos(platform, page_id)
    response = api_get_request(platform, "https://api.yeswehack.com/programs?page=#{page_id}")
    return unless response&.code == 200

    json_body = JSON.parse(response.body)
    { nb_pages: json_body['pagination']['nb_pages'], programs: json_body['items'] }
  end

  def self.parse_programs(programs, platform)
    programs.each do |program|
      # In case it is not yet present in the database we add the program
      if Program.find_by(slug: program['slug']).nil?
        Program.create(name: program['title'], slug: program['slug'], vdp: program['vdp'], platform_id: platform.id)
      end

      # And in any case we update the scopes of the program
      update_scopes(platform, program['slug'])
    end
  end

  def self.update_scopes(platform, slug)
    scope_infos = get_scope_infos(platform, slug)
    return if scope_infos.nil? || scope_infos.empty?

    parse_scopes(scope_infos, slug, platform)
  end

  def self.get_scope_infos(platform, slug)
    response = api_get_request(platform, "https://api.yeswehack.com/programs/#{slug}")
    return unless response&.code == 200

    JSON.parse(response.body)['scopes']
  end

  def self.parse_scopes(scopes, slug, platform)
    program = Program.find_by(slug: slug)
    scopes.each do |scope|
      type = scope['scope_type']
      next unless %w[web-application api].include?(type)
      next unless Scope.find_by(scope: scope['scope'], program_id: program.id).nil?

      scope = Scope.new(scope: scope['scope'], scope_type: type, program_id: program.id)
      scope.normalize(platform)
    end
  end

  def self.get_reports(platform, collab, page_id = 1)
    api_url = if collab
                "https://api.yeswehack.com/collaborator/reports?page=#{page_id}"
              else
                "https://api.yeswehack.com/user/reports?page=#{page_id}"
              end

    response = api_get_request(platform, api_url)
    return unless response&.code == 200

    response_json = JSON.parse(response.body)
    nb_pages = response_json['pagination']['nb_pages']
    reports = response_json['items']

    parse_reports(reports, platform, collab)
    return if page_id == nb_pages

    get_reports(platform, collab, page_id + 1)
  end

  def self.parse_reports(reports, platform, collab)
    reports.each do |report|
      report_infos = reports_infos(report['id'], collab, platform)

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
  end

  def self.reports_infos(report_id, collab, platform)
    response = api_get_request(platform, "https://api.yeswehack.com/reports/#{report_id}/logs")
    return unless response&.code == 200

    reports = JSON.parse(response.body)['items']
    parse_reports_infos(platform, reports, collab, report_id)
  end

  def self.parse_reports_infos(platform, reports, collab, report_id)
    report_infos = { reward: 0, collab: collab }

    reports.each do |item|
      next unless item

      report_infos[:severity] = item['old_cvss']['criticity'] unless item['old_cvss']['criticity'].nil?
      report_infos[:severity] = item['new_cvss']['criticity'] unless item['new_cvss']['criticity'].nil?

      report_infos[:collab] = true if item['type'] == 'collaborator-added'
      next unless item['type'] == 'reward' && item['user_rewarded']['username'] == platform.hunter_username

      report_infos[:reward] += item['bounty_reward_amount'] / 100.to_f
    end
    report_infos[:severity] = report_severity(platform, report_id) if report_infos[:severity].nil?

    report_infos
  end

  def self.report_severity(platform, report_id)
    response = api_get_request(platform, "https://api.yeswehack.com/reports/#{report_id}")
    return unless response&.code == 200

    JSON.parse(response.body)['criticity']
  end

  def self.api_get_request(platform, url)
    Typhoeus::Request.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer #{platform.jwt}"
      }
    )
  end

  def self.api_post_request(url, data)
    Typhoeus::Request.post(
      url,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
  end
end
