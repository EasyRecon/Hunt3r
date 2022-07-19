class ReconScan
  def self.start
    InteractDashboard.update_scan_status('Recon - Start')
    Slack.notify(":new: Recon scan started for #{OPTIONS[:domain]}")

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

    if OPTIONS[:gau]
      InteractDashboard.update_scan_status('Recon - GAU')
      Gau.get_urls
    end
    # **-- END OF THE ACTIVE CHECK PHASE

    Slack.notify(build_end_message)
  end
end

private

def build_end_message
  nb_domains = `wc -l #{OPTIONS[:output]}/all_domains.txt`.strip.split(' ')[0]
  nb_domains_alive = `wc -l #{OPTIONS[:output]}/httpx.txt`.strip.split(' ')[0]

  output = ":stopwatch: Recon scan finished for #{OPTIONS[:domain]} :"
  output += "\n  - Number of detected domains : #{nb_domains}"
  output += "\n  - Number of detected and accessible domains : #{nb_domains_alive}"

  if OPTIONS[:nuclei]
    nb_vulns = `wc -l #{OPTIONS[:output]}/nuclei.json`.strip.split(' ')[0]
    output += "\n  - Number of detected vulnerabilities : #{nb_vulns}"
  end

  output
end

def clean_domains
  regex_string = OPTIONS[:excludes].split(',')
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
