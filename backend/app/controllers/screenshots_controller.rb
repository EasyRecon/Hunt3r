class ScreenshotsController < ApplicationController
  before_action :authenticate_user, except: %i[create_outside]

  # GET /screenshots
  def index
    screenshot = Screenshot.find_by(subdomain_id: params[:subdomain_id])
    if screenshot.nil? || !base64?(screenshot.screenshot)
      return render status: 422, json: { message: I18n.t('errors.controllers.screenshots.invalid'), data: nil }
    end

    decoded = Base64.decode64(screenshot.screenshot)

    send_data(decoded, type: 'image/png', disposition: 'inline')
  end

  # POST /screenshots
  # Accessible from outside
  def create_outside
    new_screenshot = params.require(:screenshot).permit(:token, :subdomain, :screenshot)

    unless hunt3r_token_valid?(new_screenshot[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.screenshots.invalid'), data: nil }
    end

    subdomain = Subdomain.find_by(url: new_screenshot[:subdomain])

    if subdomain.screenshot.nil?
      Screenshot.create(screenshot: new_screenshot[:screenshot], subdomain_id: subdomain.id)
    else
      subdomain.screenshot.update
    end
  end
end
