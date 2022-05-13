json.message nil
json.data do
  json.domain 'domain.tld|*'
  json.type_scan 'recon|nuclei'
  json.meshs false
  json.provider 'scaleway'
  json.notifs false
  json.active_recon false
  json.intel false
  json.excludes %w[pattern1 pattern2]
  json.leak false
  json.nuclei false
  json.all_templates false
  json.nuclei_severity 'info,medium'
  json.custom_templates %w[template1 template2]
  json.custom_interactsh false
  json.permutation false
  json.gau false
end
