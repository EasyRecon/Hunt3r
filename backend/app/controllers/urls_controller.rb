class UrlsController < ApplicationController

  before_action :authenticate_user, except: %i[create_outside]

  def index
    @urls = if params[:status_code]
              Url.where(subdomain_id: params[:subdomain_id], status_code: params[:status_code])
            else
              Url.where(subdomain_id: params[:subdomain_id])
            end

    @urls = @urls.page(params[:page]).per(params[:limit])

    render status: 200, template: 'urls/index'
  end

  # POST /urls
  # Accessible from outside
  def create_outside
    new_urls = params.require(:urls).permit(:token, :subdomain, urls: %i[url status_code content_length])

    unless hunt3r_token_valid?(new_urls[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.urls.invalid'), data: nil }
    end

    subdomain = Subdomain.find_by_url(new_urls[:subdomain])

    new_urls[:urls].each do |url|
      current_url = Url.find_by(url: url[:url], subdomain_id: subdomain.id)
      if current_url.nil?
        Url.create(url: url[:url], status_code: url[:status_code], content_length: url[:content_length], subdomain_id: subdomain.id)
      else
        current_url.update(status_code: url[:status_code], content_length: url[:content_length])
      end
    end

  end
end
