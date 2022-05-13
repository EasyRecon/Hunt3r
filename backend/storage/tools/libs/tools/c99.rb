class C99
  def self.check_domains
    return if File.zero?('')

    domains = File.open("#{OPTIONS[:output]}/whoxy_domains.txt").read
    domains.each_line do |domain|
      next if domain.end_with?(".#{OPTIONS[:domain]}")

      response = Typhoeus::Request.get(
        "https://api.c99.nl/subdomainfinder?key=#{OPTIONS[:c99_token]}&domain=#{domain.chomp}&json"
      )
      next unless response&.code == 200

      response_json = JSON.parse(response.body)
      next unless response_json.key?('subdomains')

      # If there are not at least 2 sub-domains we don't care
      next if response_json['subdomains'].size < 3

      Amass.get_domains(domain.chomp)
    end
  end
end
