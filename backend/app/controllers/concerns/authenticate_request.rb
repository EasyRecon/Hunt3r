module AuthenticateRequest
  extend ActiveSupport::Concern
  require 'json_web_token'

  def authenticate_user
    render status: 401, json: { message: I18n.t('errors.controllers.auth.unauthenticated'), data: nil } unless current_user
  end

  def admin?
    render status: 401, json: { message: I18n.t('errors.controllers.insufficient_privileges'), data: nil } unless current_user.role == 'admin'
  end

  def current_user
    return @current_user if @current_user

    @current_user = nil
    return unless decoded_token

    data = decoded_token

    user = User.find_by(id: data[:user_id])
    session = Session.search(data[:user_id], data[:token])

    return unless user && session && !session.is_late?

    session.used
    @current_user ||= user
  end

  def decoded_token
    header = request.headers['Authorization']
    header = header.split(' ').last if header

    return unless header

    begin
      @decoded_token ||= JsonWebToken.decode(header)
    rescue Error => e
      render json: { message: [e.message] }, status: :unauthorized
    end
  end
end