class Admin::UsersController < ApplicationController
  before_action :authenticate_user, :admin?

  # GET /admin/users
  def index
    @users = User.all

    render status: 200, template: 'admin/users/index'
  end

  # POST /admin/users
  def create
    user_params = params.require(:user).permit(:email, :password, :password_confirmation)
    @user = User.new(user_params)

    if @user.valid?
      @user.save

      render status: 200, json: { message: I18n.t('success.controllers.admin.users.created'), data: nil }
    else
      render status: 422, json: { message: I18n.t('errors.controllers.admin.users.created'), data: nil }
    end
  end

  # DELETE /admin/users/:id
  def destroy
    @user = User.find_by(id: params[:id])

    if @user.nil?
      render status: 422, json: { message: I18n.t('errors.controllers.admin.users.unknown'), data: nil }
    else
      @user.destroy
      render status: 200, json: { message: I18n.t('success.controllers.admin.users.deleted'), data: nil }
    end

  end
end
