class Hackerone
  def self.get_jwt(platform)
    # There is no JWT on hackerone, use this method to make sure the login is valid
    response = api_request(platform, 'https://api.hackerone.com/v1/hackers/me/reports')
    return unless response.code == 200

    platform.update(jwt: platform.password)
    platform.jwt
  end

  def self.get_username(platform)
    jwt = get_jwt(platform)
    return if jwt.nil?

    platform.email
  end

  def self.update_programs(platform, page_id = 1)
    get_jwt(platform)

    programs_infos = get_programs_infos(platform, page_id)
    return if programs_infos.nil?

    parse_programs(programs_infos[:programs], platform)
    update_programs(platform, page_id + 1) if programs_infos[:next_page]
  end

  def self.get_programs_infos(platform, page_id)
    response = api_request(platform, "https://api.hackerone.com/v1/hackers/programs?page%5Bnumber%5D=#{page_id}")
    if response&.code == 429
      sleep 65
      get_programs_infos(platform, page_id)
    end
    return unless response.code == 200

    json_body = JSON.parse(response.body)
    { next_page: json_body['links']['next'], programs: json_body['data'] }
  end

  def self.parse_programs(programs, platform)
    programs.each do |program|
      slug = program['attributes']['handle']

      # In case it is not yet present in the database we add the program
      if Program.find_by(slug: slug).nil?
        vdp = !program['attributes']['offers_bounties']
        name = program['attributes']['handle']

        Program.create(name: name, slug: slug, vdp: vdp, platform_id: platform.id)
      end

      # And in any case we update the scopes of the program
      update_scopes(platform, slug)
    end
  end

  def self.update_scopes(platform, slug)
    scope_infos = get_scope_infos(platform, slug)
    return if scope_infos.nil? || scope_infos.empty?

    parse_scopes(scope_infos, slug, platform)
  end

  def self.get_scope_infos(platform, slug)
    response = api_request(platform, "https://api.hackerone.com/v1/hackers/programs/#{slug}")
    if response&.code == 429
      sleep 65
      get_scope_infos(platform, slug)
    end
    return unless response.code == 200

    response_json = JSON.parse(response.body)
    response_json['relationships']['structured_scopes']['data']
  end

  def self.parse_scopes(scopes, slug, platform)
    program = Program.find_by(slug: slug)
    scopes.each do |scope|
      endpoint = scope['attributes']['asset_identifier']
      type = scope['attributes']['asset_type']
      next unless type == 'URL'
      next unless Scope.find_by(scope: endpoint).nil?

      scope = Scope.new(scope: endpoint, scope_type: type, program_id: program.id)
      scope.normalize(platform)
    end
  end

  def self.get_reports(platform)
    response = api_request(platform, 'https://api.hackerone.com/v1/hackers/me/reports')
    return unless response.code == 200

    reports = JSON.parse(response.body)['data']
    parse_reports(reports, platform)
  end

  def self.parse_reports(reports, platform)
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
        report_infos[:reward] = get_report_reward(platform, report_infos[:report_id])
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

  def self.get_report_reward(platform, report_id)
    response = api_request(platform, "https://api.hackerone.com/v1/hackers/reports/#{report_id}")
    return unless response.code == 200

    report_activities = JSON.parse(response.body)['data']['relationships']['activities']['data']

    reward = 0
    report_activities.each do |activity|
      next unless activity['type'] == 'activity-bounty-awarded'

      reward += activity['attributes']['bounty_amount'].to_f
      reward += activity['attributes']['bonus_amount'].to_f
    end

    reward
  end

  def self.api_request(platform, url)
    Typhoeus::Request.get(
      url,
      userpwd: "#{platform.email}:#{platform.jwt}",
      headers: { 'Accept': 'application/json' }
    )
  end
end
