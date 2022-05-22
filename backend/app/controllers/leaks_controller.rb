class LeaksController < ApplicationController
  before_action :authenticate_user, except: %i[create_outside]

  # GET /leaks
  def index
    @leaks = if params[:domain] && !params[:domain].empty?
               Domain.find_by(name: params[:domain])&.leaks
             else
               Leak.all
             end

    limit = params[:limit] == '-1' ? @leaks.count : params[:limit]
    @leaks = @leaks.page(params[:page]).per(limit) unless @leaks.nil?

    render status: 200, template: 'leaks/index'
  end

  # POST /leaks
  # Accessible from outside
  def create_outside
    leaks_params = params.require(:leaks).permit(:token, :domain, leaks: %i[username email password])

    unless hunt3r_token_valid?(leaks_params[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.leaks.invalid'), data: nil }
    end

    Thread.start do
      domain = Domain.find_by_name(leaks_params[:domain])
      leaks_params[:leaks].each do |leak|
        next if Leak.find_by(username: leak[:username], email: leak[:email].downcase, password: leak[:password], domain_id: domain.id)

        Leak.create(username: leak[:username], email: leak[:email].downcase, password: leak[:password], domain_id: domain.id)
      end
    end
  end
end
