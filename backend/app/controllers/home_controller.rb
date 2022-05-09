class HomeController < ApplicationController

  # GET /
  def index
    render json: { message: 'UP' }, status: 200
  end
end