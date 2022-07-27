class Whois
  def self.check(tool)

    domains = File.read("#{OPTIONS[:output]}/#{tool}_intel.txt")
    match = OPTIONS[:domain].split('.')[0]

    valid_domains = []
    domains.each_line do |domain|
      domain.chomp!

      if tool == 'whoxy' && domain.match?(/^#{match}\./)
        valid_domains << domain
        next
      elsif domain.match?(/^#{match}\./)
        # We can't keep this type of domain if the source is not reliable because it generates too much FP
        next
      end

      sleep 1.5 # Avoid WHOIS connection blocked | TODO : Use the Whois API to avoid sleep
      whois = `whois #{domain} | grep -iF "#{match}"`
      next if whois.nil?

      valid_domains << domain unless whois.empty?
    end

    File.write("/tmp/scan/results/#{tool}_intel_valid.txt", valid_domains.join("\n"), mode: 'a')
  end
end
