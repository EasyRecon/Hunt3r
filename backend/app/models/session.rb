class Session < ApplicationRecord
  TOKEN_LENGTH = 32
  TOKEN_LIFETIME = 12.hour

  validates :token, presence: true, uniqueness: { case_sensitive: true }

  belongs_to :user

  before_validation :generate_token, on: :create
  after_create :used

  def is_late?
    if (last_used_at + TOKEN_LIFETIME) >= Time.now
      false
    else
      update(status: false)
      true
    end
  end

  def self.search user_id, token
    Session.find_by(token: token, status: true, user_id: user_id)
  end

  def used
    update(last_used_at: Time.now)
  end

  def close
    update(status: false)
  end

  def generate_token
    self.token = loop do
      random_token = SecureRandom.base58(TOKEN_LENGTH)
      break random_token unless Session.exists?(token: random_token)
    end
  end
end