require 'get_platform_jwt'
require 'platform_sync'

class ScopesController < ApplicationController
  include(GetPlatformJwt)
  include(PlatformSync)

  before_action :authenticate_user

  # GET /programs/:id/scopes
  def index
    @scopes = Scope.where(program_id: params[:id]).order(id: :asc).filtered(query_params)

    render status: 200, template: 'scopes/index'
  end

  # PATCH /programs/:id/scopes
  def update
    program = Program.find_by_id(params[:id])
    platform = Platform.find_by_id(program.platform_id)

    case platform.name
    when 'yeswehack'
      jwt = get_platform_jwt(platform)
      update_yeswehack_scope(jwt, program['slug'])
    else
      return render status: 422, json: { message: I18n.t('errors.controllers.programs.unknown'), data: nil }
    end

    render status: 200, json: { message: I18n.t('success.controllers.scopes.updated'), data: nil }
  end
end

private

def query_params
  params[:scope] || ''
end
