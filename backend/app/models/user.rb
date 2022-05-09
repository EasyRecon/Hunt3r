class User < ApplicationRecord
  has_secure_password

  validates :email,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: {
              with: /\A([\w+\-]\.?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/,
              message: I18n.t('errors.models.user.format_email')
            }

  validates :password, format: { with: /\A(?=.*).{8,72}\z/, message: I18n.t('errors.models.user.format_password') }, unless: :password?

  before_save :downcase_email!

  has_many :sessions, dependent: :destroy

  private

  def password?
    password.nil?
  end

  # downcase email
  def downcase_email!
    email&.downcase!
  end
end
