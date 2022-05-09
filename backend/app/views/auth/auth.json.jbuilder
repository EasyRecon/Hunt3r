json.Authorization @token
json.user do
  json.extract! @user, :id, :email, :role, :created_at
end