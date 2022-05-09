class Url < ApplicationRecord
  scope :filtered, ->(query_params) { where('status_code LIKE ?', query_params) }
end
