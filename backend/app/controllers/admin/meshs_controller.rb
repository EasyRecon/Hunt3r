class Admin::MeshsController < ApplicationController
  before_action :authenticate_user, :admin?

  # GET /admin/meshs
  def index
    @meshs = Mesh.all

    render status: 200, template: 'admin/mesh/index'
  end

  # POST /admin/meshs
  def create
    mesh_params = params.require(:mesh).permit(:name, :url, :token)
    mesh = Mesh.new(mesh_params)

    if mesh.valid?
      mesh.save

      render status: 200, json: { message: I18n.t('success.controllers.admin.meshs.created'), data: nil }
    else
      render status: 422, json: { message: mesh.errors.objects.first.full_message, data: nil }
    end
  end

  # PATCH /admin/meshs
  def update
    new_params = params.require(:mesh).permit(:name, :url, :token)

    mesh = Mesh.find_by_url(new_params[:url])
    if mesh.nil?
      return render status: 422, json: { message: I18n.t('success.controllers.admin.meshs.unknown'), data: nil }
    end

    mesh.update(new_params)
    return render status: 422, json: { message: mesh.errors.objects.first.full_message, data: nil } unless mesh.valid?

    render status: 200, json: { message: I18n.t('success.controllers.admin.meshs.updated'), data: nil }
  end

  # DELETE /admin/meshs/:id
  def destroy
    mesh = Mesh.find_by(id: params[:id])

    if mesh.nil?
      render status: 422, json: { message: I18n.t('errors.controllers.admin.meshs.unknown'), data: nil }
    else
      mesh.destroy
      render status: 200, json: { message: I18n.t('success.controllers.admin.meshs.deleted'), data: nil }
    end
  end

  # POST /admin/meshs/sync
  def sync
    mesh = params.require(:meshs).permit(:url, :token, :type, :domain)
    return unless Mesh.find_by(url: mesh[:url], token: mesh[:token])

    domains = get_mesh_domains(mesh[:url], mesh[:token], mesh[:type], mesh[:domain])
    if mesh[:type] == 'subdomain'
      domain = Domain.find_by(name: mesh[:domain])
      domain = Domain.create(name: mesh[:domain]) if domain.nil?

      register_subdomains(domains, domain, mesh[:url], mesh[:token])
    end


    render status: 200, json: { message: nil, data: domains }
  end

  private

  def get_mesh_domains(url, token, type, domain)
    hunt3r_url = request.protocol + request.host_with_port

    response = Typhoeus::Request.post(
      File.join(url, 'api/domains/mesh'),
      body: { meshs: { url: hunt3r_url, token: token, type: type, domain: domain } }.to_json,
      headers: { 'Content-Type' => 'application/json' }
    )
    return unless response&.code == 200

    JSON.parse(response.body)['data']
  end

  def register_subdomains(subdomains, domain, url, token)
    subdomains.each do |subdomain|
      new_subdomain = {
        url: subdomain[0],
        infos: subdomain[1],
        domain_id: domain.id
      }

      Subdomain.create(new_subdomain)
    end
  end
end
