class Scope < ApplicationRecord
  scope :filtered, ->(query_params) { where('scope LIKE ?', "%#{query_params}%") }

  def nb_leaks
    0
  end
end
