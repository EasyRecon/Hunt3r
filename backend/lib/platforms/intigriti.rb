class Intigriti
  def self.get_jwt(platform)
    return unless platform.jwt.nil? || (Time.now - platform.updated_at) > 3500

    # Use Mechanize otherwise the login flow is a hell with Typhoeus
    mechanize = Mechanize.new
    submit_credentials(mechanize, platform)
    submit_otp(mechanize, platform)

    jwt_token = get_jwt_token(mechanize)
    return unless jwt_token

    platform.update(jwt: jwt_token)
    jwt_token
  end

  def self.get_username(platform)
    get_jwt(platform)

    response = api_request(platform, 'https://api.intigriti.com/user/user')
    return unless response&.code == 200

    JSON.parse(response.body)['userName']
  end

  def self.submit_credentials(mechanize, platform)
    login_page = mechanize.get('https://login.intigriti.com/account/login')
    form = login_page.forms.first

    form.field_with(id: 'Input_Email').value = platform.email
    form.field_with(id: 'Input_Password').value = platform.password

    form.submit
  end

  def self.submit_otp(mechanize, platform)
    return unless platform.otp && !platform.otp.empty?

    totp_page = mechanize.get('https://login.intigriti.com/account/loginwith2fa')
    form = totp_page.forms.first

    totp_code = ROTP::TOTP.new(platform.otp)
    form.field_with(id: 'Input_TwoFactorAuthentication_VerificationCode').value = totp_code.now

    form.submit
  end

  def self.get_jwt_token(mechanize)
    begin
      token_page = mechanize.get('https://app.intigriti.com/auth/token')
    rescue Mechanize::ResponseCodeError
      return
    end
    return unless token_page&.body

    token_page.body.undump
  end

  def self.update_programs(platform)
    get_jwt(platform)
    programs_infos = get_programs_infos(platform)
    return if programs_infos.nil?

    parse_programs(programs_infos, platform)
  end

  def self.get_programs_infos(platform)
    response = api_request(platform, 'https://api.intigriti.com/core/researcher/program')
    return unless response&.code == 200

    JSON.parse(response.body)
  end

  def self.parse_programs(programs, platform)
    programs.each do |program|
      # In case it is not yet present in the database we add the program
      if Program.find_by(slug: program['handle']).nil?
        vdp = !(program['maxBounty']['value']).positive?
        Program.create(name: program['companyHandle'], slug: program['handle'], vdp: vdp, platform_id: platform.id)
      end

      # And in any case we update the scopes of the program
      update_scopes(platform, program['companyHandle'], program['handle'])
    end
  end

  def self.update_scopes(platform, name, slug)
    scope_infos = get_scope_infos(platform, name, slug)
    return if scope_infos.nil? || scope_infos.empty?

    parse_scopes(scope_infos, slug, platform)
  end

  def self.get_scope_infos(platform, name, slug)
    response = api_request(platform, "https://api.intigriti.com/core/researcher/program/#{name}/#{slug}")
    return unless response&.code == 200

    JSON.parse(response.body)['domains'].last['content']
  end

  def self.parse_scopes(scopes, slug, platform)
    program = Program.find_by(slug: slug)
    scopes.each do |scope|
      type = scope['type']
      next unless type == 1
      next unless Scope.find_by(scope: scope['endpoint']).nil?

      scope = Scope.new(scope: scope['endpoint'], scope_type: type, program_id: program.id)
      scope.normalize(platform)
    end
  end

  def self.get_reports(platform)
    response = api_request(platform, 'https://api.intigriti.com/core/researcher/submission')
    return unless response&.code == 200

    reports = JSON.parse(response.body)
    parse_reports(platform, reports)
  end

  def self.parse_reports(platform, reports)
    reports.each do |report|
      report_data = report_infos(platform, report['programId'], report['id'])
      report_data[:report_title] = report['title']
      report_data[:severity] = report['severity']
      report_data[:report_status] = [report['state']['status'], report['state']['closeReason']].join(',')
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

  def self.report_infos(platform, program_id, report_id)
    response = api_request(platform, "https://api.intigriti.com/core/researcher/program/#{program_id}/submission/#{report_id}")
    return unless response&.code == 200

    report_infos = JSON.parse(response.body)

    infos = { reward: 0, currency: '', collab: report_infos['collaborators'].size > 1 }

    report_infos['payouts'].each do |payout|
      next unless payout['researcher']['userName'] == platform.hunter_username

      infos[:reward] += payout['amount']['value']
      infos[:currency] = payout['amount']['currency']
    end

    infos
  end

  def self.payouts(platform, from, to)
    from = Date.parse(from).to_time.to_i # 00:00 AM
    to = Date.parse(to).to_time.to_i + 86_399 # 23:59 PM

    response = api_request(platform, 'https://api.intigriti.com/core/researcher/payout')
    return unless response&.code == 200

    payouts = JSON.parse(response.body)
    parse_payouts(payouts, from, to)
  end

  def self.parse_payouts(payouts, from, to)
    payouts_data = {}

    payouts.each do |payout|
      next unless payout['createdAt'] > from && payout['createdAt'] < to

      paid_date = DateTime.strptime(payout['createdAt'].to_s, '%s').strftime('%d-%m-%Y')

      if payouts_data.has_key?(payout['submissionCode'])
        payouts_data[payout['submissionCode']][:amount] += payout['amount']['value']
      else
        payouts_data[payout['submissionCode']] = { date: paid_date, title: payout['submissionTitle'], amount: payout['amount']['value'] }
      end
    end

    payouts_data
  end

  def self.api_request(platform, url)
    Typhoeus::Request.get(
      url,
      headers: { Authorization: "Bearer #{platform.jwt}" }
    )
  end
end
