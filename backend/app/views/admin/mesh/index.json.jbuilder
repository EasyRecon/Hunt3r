json.message nil
json.data do
  json.array! @meshs do |mesh|
    json.id mesh.id
    json.name mesh.name
    json.url mesh.url
    json.token mesh.token
  end
end
