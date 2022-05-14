class Platform < ApplicationRecord
  has_many :PlatformStat, dependent: :delete_all
  has_many :programs, dependent: :destroy

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  before_save { name.downcase! }
end
