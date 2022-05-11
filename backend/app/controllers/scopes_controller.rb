require 'platforms'

class ScopesController < ApplicationController
  include(Platforms)

  before_action :authenticate_user

  # GET /programs/:id/scopes
  def index
    @scopes = Scope.where(program_id: params[:id]).order(id: :asc).filtered(query_params)

    render status: 200, template: 'scopes/index'
  end

  # PATCH /programs/:id/scopes
  def update
    program = Program.find_by(id: params[:id])
    platform = Platform.find_by(id: program.platform_id)

    update_scopes(platform, program['slug'])

    render status: 200, json: { message: I18n.t('success.controllers.scopes.updated'), data: nil }
  end
end

private

def query_params
  params[:scope] || ''
end
