json.message nil
json.data do
  json.array! @providers do |provider|
    json.name provider.name

    json.infos do
      json.access_key provider.infos['access_key'] if provider.infos['access_key']
      json.secret_key provider.infos['secret_key'].gsub(/[a-zA-Z0-9]/, '*') if provider.infos['secret_key']
      json.organization_id provider.infos['organization_id'] if provider.infos['organization_id']
      json.project_id provider.infos['project_id'] if provider.infos['project_id']
      json.region provider.infos['region'] if provider.infos['region']
      json.zone provider.infos['zone'] if provider.infos['zone']
      json.ssh_key provider.infos['ssh_key']
    end
  end
end
