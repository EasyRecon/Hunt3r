json.message
json.data do
  json.array! @domains do |domain|
    json.id domain.id
    json.name domain.name
    json.nb_subdomain domain.nb_subdomains(domain)
    json.updated_at domain.updated_at.to_date
  end
end
json.total_pages @domains.total_pages