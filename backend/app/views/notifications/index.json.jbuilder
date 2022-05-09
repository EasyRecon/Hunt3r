json.message nil
json.data do
  json.array! @notifications do |notif|
    json.message_type notif.type_message
    json.message notif.message
    json.created_at notif.created_at.strftime('%Y-%m-%d %H:%M:%S %Z')
  end
end
