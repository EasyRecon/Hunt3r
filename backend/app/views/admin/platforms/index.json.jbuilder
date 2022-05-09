json.message nil
json.data do
  json.array! @platforms do |platform|
    json.name platform.name
    json.email platform.email
    json.username platform.hunter_username
  end
end
