class VulnerabilitiesController < ApplicationController

  before_action :authenticate_user, except: %i[create_outside]

  # GET /vulnerabilities
  def index
    @vulnerabilities = if params[:severity] && !params[:severity].empty?
                         Vulnerability.order(:severity).filtered(params[:severity])&.all
                       else
                         Vulnerability.order(:severity)
                       end

    limit = params[:limit] == '-1' ? @vulnerabilities.count : params[:limit]
    @vulnerabilities = @vulnerabilities.page(params[:page]).per(limit)

    render status: 200, template: 'vulnerabilities/index'
  end

  # DELETE /vulnerabilities/:id
  def destroy
    @vulnerability = Vulnerability.find_by(id: params[:id])

    if @vulnerability.nil?
      return render status: 422, json: { message: I18n.t('errors.controllers.vulnerabilities.unknown'), data: nil }
    end

    @vulnerability.destroy

    render status: 200, json: { message: I18n.t('success.controllers.vulnerabilities.deleted'), data: nil }
  end

  # POST /vulnerabilities
  # Accessible from outside
  def create_outside
    new_vulnerability = params.require(:vulnerability).permit(:token, :name, :severity, :matched_at)

    unless hunt3r_token_valid?(new_vulnerability[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.vulnerabilities.invalid'), data: nil }
    end

    new_vulnerability.delete('token')
    Vulnerability.create(new_vulnerability)
  end
end
