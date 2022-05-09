class SubdomainsController < ApplicationController
  before_action :authenticate_user, except: %i[create_outside]

  # POST /subdomains
  def index
    @subdomains = if params[:domain]
                    domain = Domain.find_by_name(params[:domain])
                    domain.nil? ? [] : domain.subdomain
                  else
                    Subdomain.all
                  end

    filtering_params(params).each do |key, value|
      @subdomains = @subdomains.public_send("filtered_by_#{key}", value) if value.present?
    end

    @subdomains = @subdomains.page(params[:page]).per(params[:limit])

    render status: 200, template: 'subdomains/index'
  end

  # POST /subdomains
  # Accessible from outside
  def create_outside
    new_subdomains = params.require(:subdomains).permit(:token, :domain, subdomains: [
                                                          :url,
                                                          {
                                                            infos: %i[title status_code content_length location ip
                                                                      cname body_hash cdn]
                                                          }
                                                        ])

    unless hunt3r_token_valid?(new_subdomains[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.subdomains.invalid'), data: nil }
    end

    domain = Domain.find_by_name(new_subdomains[:domain])

    new_subdomains[:subdomains].each do |subdomain|
      current_subdomain = Subdomain.find_by(url: subdomain[:url])
      if current_subdomain.nil?
        Subdomain.create(url: subdomain[:url], infos: subdomain[:infos], domain_id: domain.id)
      else
        current_subdomain.update(infos: subdomain[:infos])
      end
    end
  end

  private

  def filtering_params(params)
    params.slice(:subdomain, :technology, :status_code)
  end
end
