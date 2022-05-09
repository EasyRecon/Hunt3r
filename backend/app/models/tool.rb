class Tool < ApplicationRecord
  validates :name, presence: true

  before_save { self.name.downcase! }
end
