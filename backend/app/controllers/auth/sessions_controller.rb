class Auth::SessionsController < ApplicationController
  include CreateSession

  before_action :authenticate_user, only: %i[destroy]

  # POST /auth/login
  def create
    return error_insufficient_params unless params[:email].present? && params[:password].present?

    @user = User.find_by(email: params[:email])
    return error_invalid_credentials unless @user&.authenticate(params[:password])

    @token = jwt_session_create(@user.id, @user.email)
    return error_token_create unless @token

    response.headers['Authorization'] = "Bearer #{@token}"
    render status: :created, template: 'auth/auth'
  end

  # DELETE /auth/logout
  def destroy
    headers = request.headers['Authorization'].split(' ').last
    session = Session.find_by(token: JsonWebToken.decode(headers)[:token])
    session.close

    render status: :no_content, json: {}
  end

  protected

  def error_invalid_credentials
    render status: :unauthorized, json: { message: I18n.t('errors.controllers.auth.invalid_credentials'), data: nil }
  end

  def error_token_create
    render status: :unprocessable_entity, json: { message: I18n.t('errors.controllers.auth.token_not_created'), data: nil }
  end

  def error_insufficient_params
    render status: :unprocessable_entity, json: { message: I18n.t('errors.controllers.insufficient_params'), data: nil }
  end
end
