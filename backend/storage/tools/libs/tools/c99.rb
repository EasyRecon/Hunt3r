class C99
  def self.check_domains
    return unless File.exist?("#{OPTIONS[:output]}/intel_domains.txt")

    domains = File.open("#{OPTIONS[:output]}/intel_domains.txt").read
    domains.each_line do |domain|
      domain.chomp!
      next if domain == OPTIONS[:domain]

      response = Typhoeus::Request.get(
        "https://api.c99.nl/subdomainfinder?key=#{OPTIONS[:c99_token]}&domain=#{domain}&json"
      )
      next unless response&.code == 200

      response_json = JSON.parse(response.body)
      next unless response_json.key?('subdomains')

      # If there are not at least 2 sub-domains we don't care
      next if response_json['subdomains'].size < 3

      Amass.get_domains(domain)
    end
  end
end
