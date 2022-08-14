class Program < ApplicationRecord
  belongs_to :platform
  has_many :scopes, dependent: :delete_all

  scope :filtered, ->(query_params) { where('lower(name) LIKE ?', "%#{query_params.downcase}%") }

  def nb_scope
    Scope.where(program_id: id).size
  end
end
