class ServersController < ApplicationController
  before_action :authenticate_user, except: %i[destroy_outside]

  # GET /servers
  def index
    @servers = Server.all

    render status: 200, template: 'servers/index'
  end

  # DELETE /servers/:uid
  def destroy
    server = Server.find_by(uid: params[:uid])
    return render status: 422, json: { message: I18n.t('errors.controllers.servers.unknown'), data: nil } if server.nil?

    server_delete(server)
    render status: 200, json: { message: I18n.t('success.controllers.servers.deleted'), data: nil }
  end

  # DELETE /servers/:uid/outside
  # Accessible from outside
  def destroy_outside
    unless hunt3r_token_valid?(params[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.servers.invalid'), data: nil }
    end

    server = Server.find_by(uid: params[:uid])
    return if server.nil?

    server_delete(server)
  end
end
