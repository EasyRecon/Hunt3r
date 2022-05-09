class InteractDashboard
  def self.send_notification(type, message)
    return unless OPTIONS[:url] && OPTIONS[:hunt3r_token] && type && message

    data = { notification: { token: OPTIONS[:hunt3r_token], type_message: type, message: message } }.to_json

    request = Typhoeus::Request.new(
      File.join(OPTIONS[:url], '/notifications'),
      method: :post,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end

  def self.update_scan_status(state)
    return unless state

    data = { scan: { token: OPTIONS[:hunt3r_token], scan_id: OPTIONS[:scan_id], state: state } }.to_json

    request = Typhoeus::Request.new(
      File.join(OPTIONS[:url], '/scans'),
      method: :patch,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end

  def self.delete_server
    request = Typhoeus::Request.new(
      File.join(OPTIONS[:url], "/servers/#{OPTIONS[:srv_uid]}/outside?token=#{OPTIONS[:hunt3r_token]}"),
      method: :delete,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end

  def self.send_leaks(leaks)
    return unless leaks

    data = { leaks: { token: OPTIONS[:hunt3r_token], domain: OPTIONS[:domain], leaks: leaks } }.to_json

    request = Typhoeus::Request.new(
      File.join(OPTIONS[:url], '/leaks'),
      method: :post,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end

  def self.send_subdomain(subdomains)
    return unless subdomains

    data = { subdomains: { token: OPTIONS[:hunt3r_token], domain: OPTIONS[:domain], subdomains: subdomains } }.to_json

    request = Typhoeus::Request.new(
      File.join(OPTIONS[:url], '/subdomains'),
      method: :post,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end

  def self.send_screenshot(subdomain, screenshot)
    return unless subdomain && screenshot

    data = { screenshot: { token: OPTIONS[:hunt3r_token], subdomain: subdomain, screenshot: screenshot } }.to_json

    request = Typhoeus::Request.new(
      File.join(OPTIONS[:url], '/screenshots'),
      method: :post,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end

  def self.send_vulnerability(name, severity, matched_at)
    return unless name && severity && matched_at

    data = { vulnerability: { token: OPTIONS[:hunt3r_token], name: name, severity: severity, matched_at: matched_at } }.to_json

    request = Typhoeus::Request.new(
      File.join(OPTIONS[:url], '/vulnerabilities'),
      method: :post,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end

  def self.send_urls(subdomain, urls)
    return unless subdomain && !urls.empty?

    data = { urls: { token: OPTIONS[:hunt3r_token], subdomain: subdomain, urls: urls } }.to_json

    request = Typhoeus::Request.new(
      File.join(OPTIONS[:url], '/urls'),
      method: :post,
      body: data,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end
end
