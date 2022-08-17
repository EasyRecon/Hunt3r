class WappaGo
  def self.check_domains
    # TODO : Add others ports
    ports = '80,443'

    cmd = "cat #{OPTIONS[:output]}/all_domains.txt | wappago -ports #{ports}"
    cmd += " -resolvers #{resolver_path} -screenshot #{OPTIONS[:output]}/screenshots"
    cmd += " > #{OPTIONS[:output]}/wappago.json"

    system(cmd)

    urls = []

    File.readlines("#{OPTIONS[:output]}/wappago.json").each do |line|
      result = JSON.parse(line)

      filename = "#{result['url'].gsub(%r{://|\.|:}, '_')}.png"
      screenshot = if File.exist?("#{OPTIONS[:output]}/screenshots/#{filename}")
                     data = File.open("#{OPTIONS[:output]}/screenshots/#{filename}").read
                     Base64.encode64(data)
                   end

      detected_tech = result['infos']['technologies'].nil? ? [] : result['infos']['technologies']
      subdomain = {
        url: result['url'],
        infos: {
          title: result['infos']['title'],
          status_code: result['infos']['status_code'],
          content_length: result['infos']['content_length'],
          location: result['infos']['location'],
          technologies: detected_tech,
          ip: result['infos']['ip'],
          cname: result.dig('infos', 'cname', 0),
          cdn: result['infos']['cdn'],
          ports: result['infos']['ports'],
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
