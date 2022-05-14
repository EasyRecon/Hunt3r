class Program < ApplicationRecord
  belongs_to :platform
  has_many :scopes, dependent: :delete_all

  scope :filtered, ->(query_params) { where('name LIKE ?', "%#{query_params}%") }

  def nb_scope
    Scope.where(program_id: id).size
  end
end
