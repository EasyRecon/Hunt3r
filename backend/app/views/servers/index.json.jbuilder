json.message nil
json.data do
  json.array! @servers do |server|
    json.uid server.uid
    json.name server.name
    json.domain server.scan.domain
    json.ip server.ip
    json.instance_type server.scan.instance_type
    json.state server.state
    json.cost server.scan.cost
  end
end
