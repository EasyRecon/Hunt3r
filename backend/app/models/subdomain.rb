class Subdomain < ApplicationRecord
  belongs_to :domain

  scope :filtered_by_subdomain, ->(subdomain) { where('url LIKE ?', "%#{subdomain}%") }
  scope :filtered_by_technology, ->(technology) { where('infos @> ?', "{\"technologies\": [{\"name\":\"#{technology}\"}]}") }
  scope :filtered_by_status_code, ->(status_code) { where('infos @> ?', "{\"status_code\": #{status_code}}") if status_code.to_i > 0 }
end
