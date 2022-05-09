class NucleiScan
  def self.start
    InteractDashboard.update_scan_status('Nuclei - Start')
    FileUtils.mkdir_p(OPTIONS[:output])

    FileUtils.cp('/tmp/domains.txt', "#{OPTIONS[:output]}/domains.txt")

    Nuclei.check_domains('domains')
  end
end
