class Provider < ApplicationRecord
  validates :name, presence: true, uniqueness: { case_sensitive: false }

  before_save { self.name.downcase! }
end
