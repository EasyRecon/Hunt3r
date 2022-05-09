class C99
  def self.recursive
    return if File.zero?('')

    domains = File.open("#{OPTIONS[:output]}/whoxy_domains.txt").read
    domains.each_line do |domain|
      request = Typhoeus::Request.new(
        "https://api.c99.nl/subdomainfinder?key=#{C99_TOKEN}&domain=#{domain.chomp}&json"
      )
      request.run
      response = request.response
      next unless response&.code == 200

      response_json = JSON.parse(response.body)
      next unless response_json.key?('subdomains')

      # If there are not at least 2 sub-domains we don't care
      next if response_json['subdomains'].size < 2

      Amass.get_domains(domain.chomp)
    end
  end
end
