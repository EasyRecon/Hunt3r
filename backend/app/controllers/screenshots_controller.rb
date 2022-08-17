class ScreenshotsController < ApplicationController
  before_action :authenticate_user, except: %i[index_outside create_outside]

  # GET /screenshots/:subdomain_id
  def index
    screenshot = Screenshot.find_by(subdomain_id: params[:subdomain_id])
    if screenshot.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.screenshots.invalid'), data: nil }
    end

    decoded = Base64.decode64(screenshot.screenshot)

    send_data(decoded, type: 'image/png', disposition: 'inline')
  end

  # POST /screenshots/mesh
  # Accessible from outside
  def index_outside
    mesh_infos = params.require(:meshs).permit(:url, :token, :subdomain)
    return unless Mesh.find_by(url: mesh_infos[:url], token: mesh_infos[:token])

    subdomain = Subdomain.find_by(url: mesh_infos[:subdomain])

    render json: { message: nil, data: subdomain.screenshot[:screenshot] }, status: 200
  end
end
