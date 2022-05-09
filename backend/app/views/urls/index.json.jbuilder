json.message nil
json.data do
  json.array! @urls do |url|
    json.url url.url
    json.status_code url.status_code
    json.content_length url.content_length
  end
end
json.total_pages @urls.total_pages