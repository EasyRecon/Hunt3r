class Whois
  def self.check(tool)

    domains = File.read("#{OPTIONS[:output]}/#{tool}_intel.txt")
    match = OPTIONS[:domain].split('.')[0]

    valid_domains = []
    domains.each_line do |domain|
      domain.chomp!

      root_domain = PublicSuffix.domain(domain)
      next if root_domain.nil? || root_domain == OPTIONS[:domain]

      if tool == 'whoxy' && root_domain.match?(/^#{match}\./)
        valid_domains << domain
        next
      elsif root_domain.match?(/^#{match}\./)
        # We can't keep this type of domain if the source is not reliable because it generates too much FP
        next
      end
      next if valid_domains.include?(root_domain)

      sleep 1.5 # Avoid WHOIS connection blocked | TODO : Use the Whois API to avoid sleep
      whois = `whois #{root_domain} | grep -iF "#{match}"`
      next if whois.nil? || whois.empty?

      valid_domains << root_domain
    end

    File.write("/tmp/scan/results/#{tool}_intel_valid.txt", valid_domains.join("\n"), mode: 'a')
  end
end
