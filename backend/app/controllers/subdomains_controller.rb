class SubdomainsController < ApplicationController
  before_action :authenticate_user, except: %i[create_outside]

  # POST /subdomains
  def index
    @subdomains = if params[:domain]
                    domain = Domain.find_by_name(params[:domain])
                    domain.nil? ? [] : domain.subdomains
                  else
                    Subdomain.all
                  end

    filtering_params(params).each do |key, value|
      @subdomains = @subdomains.public_send("filtered_by_#{key}", value) if value.present?
    end

    limit = params[:limit] == '-1' ? @subdomains.count : params[:limit]
    @subdomains = @subdomains.page(params[:page]).per(limit)

    render status: 200, template: 'subdomains/index'
  end

  # POST /subdomains
  # Accessible from outside
  def create_outside
    infos = params.require(:subdomain).permit(:token, :domain, subdomain: [
                                                          :url,
                                                          {
                                                            infos: [:title, :status_code, :content_length, :location,
                                                                    :ip, :cname, :body_hash, :cdn, :screenshot,
                                                                    technologies: [], ports: []]
                                                          }
                                                        ])

    unless hunt3r_token_valid?(infos[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.subdomains.invalid'), data: nil }
    end

    domain = Domain.find_by_name(infos[:domain])

    current_subdomain = Subdomain.find_by(url: infos[:subdomain][:url])
    screenshot = infos[:subdomain][:infos][:screenshot]

    if current_subdomain.nil?
      infos = infos[:subdomain][:infos].except(:screenshot)

      subdomain = Subdomain.create(url: infos[:subdomain][:url], infos: infos, domain_id: domain.id)
      Screenshot.create(screenshot: screenshot, subdomain_id: subdomain.id)
    else
      current_subdomain.update(infos: infos[:subdomain][:infos])
      Screenshot.update(screenshot: screenshot, subdomain_id: current_subdomain.id)
    end
  end

  private

  def filtering_params(params)
    params.slice(:subdomain, :technology, :status_code)
  end
end
