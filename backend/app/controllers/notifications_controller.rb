class NotificationsController < ApplicationController
  before_action :authenticate_user, except: %i[create_outside]

  # GET /notifications
  def index
    @notifications = Notification.all.order(id: :desc)

    render status: 200, template: 'notifications/index'
  end

  # DELETE /notifications
  def destroy
    Notification.destroy_all

    render status: 200, json: { message: I18n.t('success.controllers.notifications.deleted'), data: nil }
  end

  # POST /notifications
  # Accessible from outside
  def create_outside
    new_notif = params.require(:notification).permit(:token, :type_message, :message)

    unless hunt3r_token_valid?(new_notif[:token])
      return render status: 422, json: { message: I18n.t('errors.controllers.notifications.invalid'), data: nil }
    end

    new_notif.delete('token')
    Notification.create(new_notif)
  end
end
