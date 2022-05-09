class Httpx
  def self.check_domains
    subdomains = []

    file = File.read("#{OPTIONS[:output]}/naabu.json")
    data = JSON.parse(file)

    urls = []
    data.each do |host, infos|
      httpx = JSON.parse(`echo #{host} | httpx -silent -sc -cl -location -title -td -cname -cdn -json`)
      url = httpx['url']

      # Allows not to pollute the recon with useless domains
      # Ex http://www.domain.tld 302 to https://www.domain.tld
      next if url.start_with?('http://') && url.match?(%r{https://(www\.)?#{host}(:443)?/?})

      url.sub!(':443', '')

      subdomain = {
        url: url,
        infos: {
          title: httpx['title'],
          status_code: httpx['status-code'],
          content_length: httpx['content-length'],
          location: httpx['location'],
          technologies: httpx['technologies'],
          ip: infos['ip'],
          cname: httpx.dig('cnames', 0),
          cdn: httpx['cdn-name'],
          ports: infos['ports'],
          body_hash: httpx.dig('hashes', 'body-sha256')
        }
      }

      urls << url
      subdomains << subdomain
    end

    File.open("#{OPTIONS[:output]}/httpx.txt", 'w+') do |f|
      f.puts(urls)
    end

    if File.zero?("#{OPTIONS[:output]}/httpx.txt")
      InteractDashboard.send_notification('danger', "ScanID : #{OPTIONS[:scan_id]} | The file httpx.txt is empty")
      InteractDashboard.delete_server
    end

    InteractDashboard.send_subdomain(subdomains)
  end
end
