class WappaGo
  def self.get_screenshots
    # TODO : Add others ports
    ports = '80,443'

    cmd = "cat #{OPTIONS[:output]}/all_domains.txt | wappago -ports #{ports}"
    cmd += " -resolvers #{resolver_path} -screenshot #{OPTIONS[:output]}/screenshots"
    cmd += " > #{OPTIONS[:output]}/wappago.json"

    system(cmd)

    urls = []

    File.readlines("#{OPTIONS[:output]}/wappago.json").each do |line|
      result = JSON.parse(line)

      filename = "#{subdomain.gsub(%r{://}, '_').gsub(':', '_')}.png"
      screenshot = if File.exist?("#{OPTIONS[:output]}/screenshots/#{filename}")
                     data = File.open("#{OPTIONS[:output]}/screenshots/#{filename}").read
                     Base64.encode64(data)
                   end

      subdomain = {
        url: result['url'],
        infos: {
          title: result['title'],
          status_code: result['status_code'],
          content_length: result['content_length'],
          location: result['location'],
          technologies: result['technologies'],
          ip: result['ip'],
          cname: result.dig('cnames', 0),
          cdn: result['cdn'],
          ports: result['ports'],
          screenshot: screenshot
        }
      }

      urls << result['url']
      InteractDashboard.send_subdomain(subdomain)
    end

    if urls.empty?
      InteractDashboard.send_notification('danger', "ScanID : #{OPTIONS[:scan_id]} | The file wappago.txt is empty")
      InteractDashboard.delete_server
    end

    File.open("#{OPTIONS[:output]}/wappago.txt", 'w+') do |f|
      f.puts(urls)
    end
  end
end
