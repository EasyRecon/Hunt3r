json.message nil
json.data do
  json.array! @tools do |tool|
    json.name tool.name
    json.infos tool.infos
  end
end
