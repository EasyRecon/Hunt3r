json.message nil
json.data do
  json.array! @programs do |program|
    next if program.nb_scope.zero?

    json.id program.id
    json.name program.name
    json.slug program.slug
    json.vpd program.vdp
    json.scopes program.nb_scope
  end
end
