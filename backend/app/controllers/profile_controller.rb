class ProfileController < ApplicationController
  before_action :authenticate_user

  # GET /profile
  def index
    @user = current_user
    render status: 200, template: 'profile/index'
  end

  # PATCH /profile
  def update
    new_params = params.require(:profile).permit(:email, :password)

    @user = current_user
    @user.update(new_params)

    return render status: 422, json: { message: @user.errors.objects.first.full_message, data: nil } unless @user.valid?

    render status: 200, template: 'profile/index'
  end
end
