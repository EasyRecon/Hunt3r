json.message nil
json.data do
  json.array! @users do |user|
    json.id user.id
    json.email user.email
    json.role user.role
    json.created_at user.created_at
  end
end