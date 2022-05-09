module GetPlatformJwt
  def get_platform_jwt(platform)
    unless need_new_jwt?(platform)
      jwt = platform.jwt
      return jwt
    end

    case platform.name
    when 'yeswehack'
      jwt = yeswehack_get_jwt(platform)
      platform.update(jwt: jwt)
    when 'intigriti'
      jwt = intigriti_get_jwt(platform)
      platform.update(jwt: jwt)
    else
      return
    end

    jwt
  end

  def need_new_jwt?(platform)
    platform.jwt.nil? || (Time.now - platform.updated_at) > 3500
  end

  def yeswehack_get_jwt(platform)
    data = { email: platform.email, password: platform.password }.to_json

    request = Typhoeus::Request.new(
      'https://api.yeswehack.com/login',
      method: :post,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
    response = request.response

    return unless response.code == 200

    totp_token = JSON.parse(response.body)['totp_token']
    return unless totp_token

    totp_code = ROTP::TOTP.new(platform.otp)
    data = { token: totp_token, code: totp_code.now }.to_json

    request = Typhoeus::Request.new(
      'https://api.yeswehack.com/account/totp',
      method: :post,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
    response = request.response
    return unless response.code == 200

    jwt_token = JSON.parse(response.body)['token']
    return unless jwt_token

    jwt_token
  end

  def intigriti_get_jwt(platform)
    # Use Mechanize otherwise the login flow is a hell with Typhoeus
    mechanize = Mechanize.new

    login_page = mechanize.get('https://login.intigriti.com/account/login')
    form = login_page.forms.first

    form.field_with(id: 'Input_Email').value = platform.email
    form.field_with(id: 'Input_Password').value = platform.password

    form.submit

    if platform.otp && !platform.otp.empty?
      totp_page = mechanize.get('https://login.intigriti.com/account/loginwith2fa')
      form = totp_page.forms.first

      totp_code = ROTP::TOTP.new(platform.otp)
      form.field_with(id: 'Input_TwoFactorAuthentication_VerificationCode').value = totp_code.now

      form.submit
    end

    begin
      token_page = mechanize.get('https://app.intigriti.com/auth/token')
    rescue Mechanize::ResponseCodeError
      return
    end

    return unless token_page&.body

    token_page.body.undump
  end
end
