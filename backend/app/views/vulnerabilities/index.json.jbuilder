json.message nil
json.data do
  json.array! @vulnerabilities do |vulnerability|
    json.id vulnerability.id
    json.name vulnerability.name
    json.severity vulnerability.severity
    json.matched_at vulnerability.matched_at
    json.created_at vulnerability.created_at
  end
end
json.total_pages @vulnerabilities.total_pages
