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
      Whoxy.get_domains
      C99.check_domains
    end

    # **-- END OF THE HARVESTING PHASE OF SUBDOMAINS

    `cat #{OPTIONS[:output]}/*_domains.txt | sort -u >> #{OPTIONS[:output]}/all_domains.txt`

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
