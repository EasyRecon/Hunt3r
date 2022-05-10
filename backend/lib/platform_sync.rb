module PlatformSync
  def update_yeswehack_programs(jwt, platform, page_id = 1)
    request = Typhoeus::Request.new(
      "https://api.yeswehack.com/programs?page=#{page_id}",
      method: :get,
      headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer #{jwt}" }
    )
    request.run
    response = request.response

    return unless response&.code == 200

    nb_pages = JSON.parse(response.body)['pagination']['nb_pages']

    programs = JSON.parse(response.body)['items']
    programs.each do |program|
      # In case it is not yet present in the database we add the program
      if Program.find_by_slug(program['slug']).nil?
        Program.create(name: program['title'], slug: program['slug'], vdp: program['vdp'], platform_id: platform.id)
      end

      # And in any case we update the scopes of the program
      update_yeswehack_scope(jwt, program['slug'])
    end

    update_yeswehack_programs(jwt, platform, page_id + 1) if page_id + 1 == nb_pages
  end

  def update_yeswehack_scope(jwt, slug)
    response = Typhoeus::Request.get(
      "https://api.yeswehack.com/programs/#{slug}",
      headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer #{jwt}" }
    )
    return unless response&.code == 200

    scopes = JSON.parse(response.body)['scopes']
    return if scopes.nil? || scopes.empty?

    program = Program.find_by(slug: slug)
    scopes.each do |scope|
      next unless Scope.find_by(scope: scope['scope']).nil?

      scope_type = if scope['type'] == 1
                     'web-application'
                   else
                     scope['type']
                   end

      Scope.create(scope: scope['scope'], scope_type: scope_type, program_id: program.id)
    end
  end

  def update_intigriti_programs(jwt, platform)
    request = Typhoeus::Request.new(
      'https://api.intigriti.com/core/researcher/program',
      headers: { Authorization: "Bearer #{jwt}" }
    )
    request.run
    response = request.response

    return unless response&.code == 200

    programs = JSON.parse(response.body)
    programs.each do |program|
      # In case it is not yet present in the database we add the program
      if Program.find_by_slug(program['handle']).nil?
        vdp = !(program['maxBounty']['value']).positive?
        Program.create(name: program['companyHandle'], slug: program['handle'], vdp: vdp, platform_id: platform.id)
      end

      # And in any case we update the scopes of the program
      update_intigriti_scope(jwt, program['companyHandle'], program['handle'])
    end
  end
end

def update_intigriti_scope(jwt, name, slug)
  request = Typhoeus::Request.new(
    "https://api.intigriti.com/core/researcher/program/#{name}/#{slug}",
    headers: { Authorization: "Bearer #{jwt}" }
  )
  request.run
  response = request.response
  return unless response&.code == 200

  scopes = JSON.parse(response.body)['domains'].last['content']
  return if scopes.nil? || scopes.empty?

  program = Program.find_by_slug(slug)
  scopes.each do |scope|
    next unless Scope.find_by_scope(scope['endpoint']).nil?

    scope_type = if scope['type'] == 1
                   'Web Application'
                 else
                   scope['type']
                 end

    Scope.create(scope: scope['endpoint'], scope_type: scope_type, program_id: program.id)
  end
end

def update_hackerone_programs(platform, page_id = 1)
  request = Typhoeus::Request.new(
    "https://api.hackerone.com/v1/hackers/programs?page%5Bnumber%5D=#{page_id}",
    userpwd: "#{platform.email}:#{platform.jwt}",
    headers: { 'Accept': 'application/json' }
  )
  request.run
  response = request.response

  if response&.code == 429
    sleep 65
    update_hackerone_programs(platform, page_id)
  end
  return unless response.code == 200

  response_json = JSON.parse(response.body)

  programs = response_json['data']
  programs.each do |program|
    slug = program['attributes']['handle']

    # In case it is not yet present in the database we add the program
    if Program.find_by(slug: slug).nil?
      vdp = !program['attributes']['offers_bounties']
      name = program['attributes']['handle']

      Program.create(name: name, slug: slug, vdp: vdp, platform_id: platform.id)
    end

    # And in any case we update the scopes of the program
    update_hackerone_scope(platform, slug)
  end

  return unless response_json['links']['next']

  page_id += 1
  update_hackerone_programs(platform, page_id)
end

def update_hackerone_scope(platform, slug)
  request = Typhoeus::Request.new(
    "https://api.hackerone.com/v1/hackers/programs/#{slug}",
    userpwd: "#{platform.email}:#{platform.jwt}",
    headers: { 'Accept': 'application/json' }
  )
  request.run
  response = request.response

  if response&.code == 429
    sleep 65
    update_hackerone_scope(platform, slug)
  end
  return unless response.code == 200

  response_json = JSON.parse(response.body)
  scopes = response_json['relationships']['structured_scopes']['data']

  program = Program.find_by(slug: slug)
  scopes.each do |scope|
    endpoint = scope['attributes']['asset_identifier']
    next unless Scope.find_by(scope: endpoint).nil?

    scope_type = if scope['attributes']['asset_type'] == 'URL'
                   'Web Application'
                 else
                   scope['attributes']['asset_type']
                 end
    Scope.create(scope: endpoint, scope_type: scope_type, program_id: program.id)
  end
end
