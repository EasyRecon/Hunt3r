class Mesh < ApplicationRecord
  validates :url, presence: true, uniqueness: { case_sensitive: false, message: I18n.t('errors.models.mesh.uniqueness') }
  validates :token, format: { with: /\A(?=.*).{15,100}\z/, message: I18n.t('errors.models.mesh.format_token') }, unless: :token?

  before_save { url.downcase! }

  private

  def token?
    token.nil?
  end
end
