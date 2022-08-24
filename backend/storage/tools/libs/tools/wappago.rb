class WappaGo
  def self.check_domains
    ports = '80,81,300,443,591,593,832,981,1010,1311,2082,2087,2095,2096,2480,3000,3128,3333,4243,4567,4711,4712,4993,5000,5104,5108,5800,6543,7000,7396,7474,8000,8001,8008,8014,8042,8069,8080,8081,8088,8090,8091,8118,8123,8172,8222,8243,8280,8281,8333,8443,8500,8834,8880,8888,8983,9000,9043,9060,9080,9090,9091,9200,9443,9800,9981,12443,16080,18091,18092,20720,28017'

    cmd = "cat #{OPTIONS[:output]}/all_domains.txt | wappago -ports #{ports}"
    cmd += " -resolvers #{resolver_path} -screenshot #{OPTIONS[:output]}/screenshots"
    cmd += " -threads-chrome #{15 * OPTIONS[:concurrency]} -threads-ports #{50 * OPTIONS[:concurrency]}"
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
      exit
    end

    File.open("#{OPTIONS[:output]}/wappago.txt", 'w+') do |f|
      f.puts(urls)
    end
  end
end
