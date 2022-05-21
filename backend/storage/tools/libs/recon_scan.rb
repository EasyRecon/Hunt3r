class ReconScan
  def self.start
    InteractDashboard.update_scan_status('Recon - Start')

    if OPTIONS[:leak]
      InteractDashboard.update_scan_status('Recon - Get Leaks')
      Dehashed.get_leak
    end

    # **-- BEGINNING OF THE HARVESTING PHASE OF SUBDOMAINS
    FileUtils.mkdir_p(OPTIONS[:output])

    InteractDashboard.update_scan_status('Recon - Amass')
    Amass.get_domains
    Mesh.get_domains if OPTIONS[:meshs]

    if OPTIONS[:intel]
      InteractDashboard.update_scan_status('Recon - Intel')
      Whoxy.get_domains
      C99.check_domains
    end

    # **-- END OF THE HARVESTING PHASE OF SUBDOMAINS

    `cat #{OPTIONS[:output]}/*_domains.txt | sort -u >> #{OPTIONS[:output]}/all_domains.txt`
    clean_domains if OPTIONS[:excludes]

    # **-- START OF THE ACTIVE CHECK PHASE
    InteractDashboard.update_scan_status('Recon - Port Scanning')
    Naabu.check_domains
    Naabu.normalize

    InteractDashboard.update_scan_status('Recon - HTTPX')
    Httpx.check_domains

    InteractDashboard.update_scan_status('Recon - Screenshots')
    GoWitness.get_screenshots

    if OPTIONS[:nuclei]
      InteractDashboard.update_scan_status('Recon - Nuclei')
      Nuclei.check_domains
    end

    return unless OPTIONS[:gau]

    InteractDashboard.update_scan_status('Recon - GAU')
    Gau.get_urls
    # **-- END OF THE ACTIVE CHECK PHASE
  end
end

private

def clean_domains
  regex_string = OPTIONS[:excludes].split('|')
  regex = []
  regex_string.each do |rs|
    regex << Regexp.new(".*#{rs}.*")
  rescue StandardError
    next
  end

  input_domains = File.readlines("#{OPTIONS[:output]}/all_domains.txt")
  output_domains = []

  input_domains.each do |line|
    line.chomp!
    next if regex.any? { |r| r.match?(line) }

    output_domains << line
  end

  File.open("#{OPTIONS[:output]}/all_domains.txt", 'w+') do |f|
    f.puts(output_domains)
  end
end
