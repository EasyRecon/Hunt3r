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
end
