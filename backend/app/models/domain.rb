class Domain < ApplicationRecord
  has_many :leak, dependent: :delete_all
  has_many :subdomain, dependent: :delete_all

  scope :filtered, ->(query_params) { where("name LIKE ?", "%#{query_params}%") }

  def nb_subdomains(domain)
    domain.subdomain.size
  end
end
