json.message nil
json.data do
  json.array! @reports do |report|
    json.title report.report_title
    json.severity report.normalize_severity
    json.reward report.reward
    json.collab report.collab
    json.status report.normalize_report_status
    json.report_date report.report_date
  end
end
