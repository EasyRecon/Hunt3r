json.message nil
json.data do
  json.array! @leaks do |leak|
    json.username leak.username
    json.email leak.email
    json.password leak.password
  end
end
json.total_pages @leaks.total_pages unless @leaks.empty?
