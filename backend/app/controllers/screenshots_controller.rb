class ScreenshotsController < ApplicationController
  before_action :authenticate_user

  # GET /screenshots/:subdomain_id
  def index
    screenshot = Subdomain.find_by(id: params[:subdomain_id])[:infos]['screenshot']
    if screenshot.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.screenshots.invalid'), data: nil }
    end

    decoded = Base64.decode64(screenshot)

    send_data(decoded, type: 'image/png', disposition: 'inline')
  end
end
