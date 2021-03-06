class Whoxy
  def self.get_domains
    response = Typhoeus::Request.get(
      "http://api.whoxy.com/?key=#{OPTIONS[:whoxy_token]}&history=#{OPTIONS[:domain]}"
    )
    return unless response&.code == 200

    response_json = JSON.parse(response.body)
    return unless response_json.key?('whois_records')

    company = Set[]
    email = Set[]

    response_json['whois_records'].each do |result|
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
    next if value.end_with?(".#{OPTIONS[:domain]}")

    response = Typhoeus::Request.get(
      "http://api.whoxy.com/?key=#{OPTIONS[:whoxy_token]}&reverse=whois&#{type}=#{value}"
    )
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
