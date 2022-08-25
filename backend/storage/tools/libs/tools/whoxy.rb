class Whoxy
  def self.intel
    response = Typhoeus::Request.get(
      "https://api.whoxy.com/?key=#{OPTIONS[:whoxy_token]}&history=#{OPTIONS[:domain]}"
    )
    return unless response&.code == 200

    response_json = JSON.parse(response.body)
    return unless response_json.key?('whois_records')

    company = Set[]
    email = Set[]

    response_json['whois_records'].each do |result|
      registrant_company = result['registrant_contact']['company_name']
      if registrant_company&.match?(/#{OPTIONS[:domain].split('.')[0]}/i)
        company << result['registrant_contact']['company_name'].gsub(' ', '+')
      end

      registrant_email = result['registrant_contact']['email_address']
      if registrant_email&.include?('@') && !registrant_email&.include?('anonymised') && registrant_email&.match?(OPTIONS[:domain].split('.')[0])
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
  whois_domains = []

  data.each do |value|
    get_whoxy_results(type, value, whois_domains)
  end

  File.open("#{OPTIONS[:output]}/whoxy_intel.txt", 'w+') do |f|
    f.puts(whois_domains)
  end

  Whois.check('whoxy')
end

def get_whoxy_results(type, value, whois_domains, page=1)
  response = Typhoeus::Request.get(
    "https://api.whoxy.com/?key=#{OPTIONS[:whoxy_token]}&reverse=whois&#{type}=#{value}&page=#{page}"
  )
  return unless response&.code == 200

  response_json = JSON.parse(response.body)
  return unless response_json.key?('search_result')

  total_pages = response_json['total_pages']

  response_json['search_result'].each do |result|
    next if result['domain_name'] == OPTIONS[:domain]
    next if whois_domains.include?(result['domain_name'])

    whois_domains << result['domain_name']
  end

  get_whoxy_results(type, value, whois_domains, page + 1) unless page == total_pages
end
