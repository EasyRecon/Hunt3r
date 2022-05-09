json.message nil
json.data do
  json.array! @scopes do |scope|
    json.id scope.id
    json.scope scope.scope
    json.scope_type scope.scope_type
    json.last_scan scope.last_scan
    json.leaks scope.nb_leaks
  end
end
