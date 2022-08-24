json.message nil
json.data do
  json.array! @subdomains do |subdomain|
    json.id subdomain.id
    json.url subdomain.url
    json.infos subdomain.infos.except('screenshot')
  end
end
json.total_pages @subdomains.total_pages == 0 ? 1 : @subdomains.total_pages