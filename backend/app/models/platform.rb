class Platform < ApplicationRecord
  has_many :PlatformStat, dependent: :delete_all
  has_many :program
  
  validates :name, presence: true, uniqueness: { case_sensitive: false }

  before_save { self.name.downcase! }
end
