class Whoxy
  def self.get_domains
    request = Typhoeus::Request.new(
      "http://api.whoxy.com/?key=#{OPTIONS[:whoxy_token]}&history=#{OPTIONS[:domain]}"
    )
    request.run
    response = request.response
    return unless response&.code == 200

    response_json = JSON.parse(response.body)
    return unless response_json.key?('whois_records')

    company = Set[]
    email = Set[]

    response['whois_records'].each do |result|
      if result['registrant_contact']['company_name']&.match?(/#{OPTIONS[:domain].sub(/\..*/, '')}/i)
        company << result['registrant_contact']['company_name'].gsub(' ', '+')
      end

      if result['registrant_contact']['email_address']&.match?(OPTIONS[:domain])
        email << result['registrant_contact']['email_address']
      end
    end
    return if company.empty? && email.empty?

    reverse(company, 'company')
    reverse(email, 'email')
  end
end

private

def reverse(data, type)
  subdomains = []

  data.each do |value|
    request = Typhoeus::Request.new(
      "http://api.whoxy.com/?key=#{WHOXY_TOKEN}&reverse=whois&#{type}=#{value}"
    )
    request.run
    response = request.response
    next unless response&.code == 200

    response_json = JSON.parse(response.body)
    next unless response_json.key?('search_result')

    response_json['search_result'].each do |result|
      subdomains << result['domain_name']
    end
  end

  File.open("#{OPTIONS[:output]}/whoxy_domains.txt", 'w+') do |f|
    f.puts(subdomains)
  end
end
