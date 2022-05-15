class DomainsController < ApplicationController
  before_action :authenticate_user, except: %i[index_outside]

  # GET /domains
  def index
    @domains = Domain.filtered(query_params).all
    @domains = [] if @domains.nil?

    @domains = @domains.page(params[:page]).per(params[:limit])

    render status: 200, template: 'domains/index'
  end

  # POST /domains/mesh
  # Accessible from outside
  def index_outside
    mesh_infos = params.require(:meshs).permit(:url, :token, :type, :domain)
    return unless Mesh.find_by(url: mesh_infos[:url], token: mesh_infos[:token])

    domains = if mesh_infos[:type] == 'domain'
                Domain.all&.pluck(:name)
              else
                Domain.find_by(name: mesh_infos[:domain])&.subdomains&.pluck(:url, :infos)
              end

    render json: { message: nil, data: domains }, status: 200
  end

  # DELETE /domains/:id
  def destroy
    domain = Domain.find_by(id: params[:id]).destroy
    return render json: { message: I18n.t('errors.controllers.domains.unknown'), data: nil }, status: 200 if domain.nil?

    render json: { message: I18n.t('success.controllers.domains.deleted'), data: nil }, status: 200
  end

  private

  def query_params
    params[:domain] || ''
  end
end
