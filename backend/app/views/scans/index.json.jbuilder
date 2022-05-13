json.message nil
json.data do
  json.array! @scans do |scan|
    json.id scan.id
    json.domain scan.domain
    json.type_scan scan.type_scan
    json.meshs scan.meshs
    json.instance_type scan.instance_type
    json.provider scan.provider
    json.notifs scan.notifs
    json.active_recon scan.active_recon
    json.intel scan.intel
    json.excludes scan.excludes
    json.leak scan.leak
    json.nuclei scan.nuclei
    json.all_templates scan.all_templates
    json.permutation scan.permutation
    json.gau scan.gau
    json.custom_templates !scan.custom_templates.empty?
    json.state scan.state
    json.cost scan.cost
  end
end
