class DomainsController < ApplicationController
  before_action :authenticate_user

  # GET /domains
  def index
    @domains = Domain.filtered(query_params).all
    @domains = [] if @domains.nil?

    @domains = @domains.page(params[:page]).per(params[:limit])

    render status: 200, template: 'domains/index'
  end

  # DELETE /domains/:id
  def destroy
    domain = Domain.find_by_id(params[:id]).destroy
    return render json: { message: I18n.t('errors.controllers.domains.unknown') }, status: 200 if domain.nil?

    render json: { message: I18n.t('success.controllers.domains.deleted') }, status: 200
  end

  private

  def query_params
    params[:domain] || ''
  end
end
