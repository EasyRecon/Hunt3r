module CreateSession
  extend ActiveSupport::Concern
  require 'json_web_token'

  def jwt_session_create(user_id, user_email)
    user = User.find_by(id: user_id)
    session = user.sessions.build
    return unless user && session.save

    JsonWebToken.encode({ user_id: user_id, user_email: user_email, user_role: user.role, token: session.token })
  end
end