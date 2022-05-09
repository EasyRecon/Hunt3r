class Program < ApplicationRecord
  belongs_to :platform

  scope :filtered, ->(query_params) { where("name LIKE ?", "%#{query_params}%") }

  def nb_scope
    Scope.where(program_id: id).size
  end
end
