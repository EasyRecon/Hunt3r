class NucleiScan
  def self.start
    InteractDashboard.update_scan_status('Nuclei - Start')
    Slack.notify(":new: Nuclei scan started for #{OPTIONS[:domain]}")
    FileUtils.mkdir_p(OPTIONS[:output])

    FileUtils.cp('/tmp/domains.txt', "#{OPTIONS[:output]}/domains.txt")

    Nuclei.check_domains('domains')
    Slack.notify(":stopwatch: Nuclei scan finished for #{OPTIONS[:domain]}")
  end
end
