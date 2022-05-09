class EnginesController < ApplicationController
  before_action :authenticate_user

  # GET /engines
  def index
    @engines = Engine.all

    render status: 200, template: 'engines/index'
  end

  # POST /engines
  def create
    engine_infos = get_engine_infos
    engine = Engine.new(engine_infos)

    if engine.valid?
      engine.save

      render status: 200, json: { message: I18n.t('success.controllers.engines.created'), data: nil }
    else
      render status: 422, json: { message: engine.errors.objects.first.full_message, data: nil }
    end
  end

  # PATCH /engines
  def update
    engine = Engine.find_by_id(params[:id]).destroy
    return render status: 422, json: { message: I18n.t('errors.controllers.engines.unknown'), data: nil } if engine.nil?

    engine_infos = get_engine_infos

    unless engine.update(engine_infos)
      engine.destroy
      return render status: 422, json: { message: I18n.t('errors.controllers.engines.invalid_informations'), data: nil }
    end

    render status: 200, json: { message: I18n.t('success.controllers.engines.updated'), data: nil }
  end

  # DELETE /engines/:id
  def destroy
    engine = Engine.find_by_id(params[:id]).destroy
    return render json: { message: I18n.t('errors.controllers.engines.unknown') }, status: 422 if engine.nil?

    render json: { message: I18n.t('success.controllers.engines.deleted') }, status: 200
  end

  private

  def get_engine_infos
    params.require(:engine).permit(
      :name, infos: [:type_scan, :instance_type, :provider, :notifs, :active_recon, :intel, :leak, :nuclei,
                     :all_templates, :permutation, :gau, custom_templates: [] ]
    )
  end
end
