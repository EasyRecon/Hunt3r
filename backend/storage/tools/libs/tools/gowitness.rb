class GoWitness
  def self.get_screenshots
    cmd = "gowitness file -f #{OPTIONS[:output]}/httpx.txt --threads #{20 * OPTIONS[:concurrency]}"
    cmd += " --disable-db --disable-logging -P #{OPTIONS[:output]}/screenshots/ -X 1280 -Y 720"
    system(cmd)

    File.readlines("#{OPTIONS[:output]}/httpx.txt").each do |subdomain|
      subdomain.chomp!
      filename = "#{subdomain.gsub(%r{://}, '-').gsub(':', '-')}.png"
      next unless File.exist?("#{OPTIONS[:output]}/screenshots/#{filename}")

      data = File.open("#{OPTIONS[:output]}/screenshots/#{filename}").read
      encoded = Base64.encode64(data)

      InteractDashboard.send_screenshot(subdomain, encoded)
    end
  end
end
