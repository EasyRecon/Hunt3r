class Domain < ApplicationRecord
  has_many :leaks, dependent: :delete_all
  has_many :subdomains, dependent: :delete_all

  scope :filtered, ->(query_params) { where('name LIKE ?', "%#{query_params}%") }

  def nb_subdomains(domain)
    domain.subdomains.size
  end
end
