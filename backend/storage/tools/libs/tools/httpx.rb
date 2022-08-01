class Httpx
  def self.check_domains
    subdomains = []

    file = File.read("#{OPTIONS[:output]}/naabu.json")
    data = JSON.parse(file)

    pool = Concurrent::FixedThreadPool.new(6 * OPTIONS[:concurrency])

    urls = []
    data.each do |host, infos|
      pool.post do

        httpx_ports = ''
        infos['ports'].each do |port|
          httpx_ports += case port
                         when 80
                           "http:#{port}"
                         when 443
                           "https:#{port}"
                         else
                           port.to_s
                         end

          httpx_ports += ',' unless infos['ports'].last == port
        end

        httpx = `echo #{host} | httpx -silent -sc -cl -location -title -td -cname -cdn -ports #{httpx_ports} -json`
        next if httpx.empty?

        httpx.chomp!
        results = httpx.split("\n")

        results.each do |result|
          result_json = JSON.parse(result)
          url = result_json['url']

          # Allows not to pollute the recon with useless domains
          # Ex http://www.domain.tld 302 to https://www.domain.tld
          next if url.start_with?('http://') && result_json['location']&.match?(%r{https://(www\.)?#{host}(:443)?/?})
          next if url.start_with?('https://') && url.end_with?(':80')
          next if url.start_with?('http://') && url.end_with?(':443')

          url.sub!(':443', '') if url.end_with?(':443')
          url.sub!(':80', '') if url.end_with?(':80')

          technologies = []

          begin
            wappalyzer = JSON.load(`node /root/Tools/wappalyzer/src/drivers/npm/cli.js #{url}`)
            wappalyzer['technologies']&.each do |technology|
              technologies << technology['name']
            end
          rescue
          end

          subdomain = {
            url: url,
            infos: {
              title: result_json['title'],
              status_code: result_json['status-code'],
              content_length: result_json['content-length'],
              location: result_json['location'],
              technologies: technologies,
              ip: infos['ip'],
              cname: result_json.dig('cnames', 0),
              cdn: result_json['cdn-name'],
              ports: infos['ports'],
              body_hash: result_json.dig('hashes', 'body-sha256')
            }
          }

          urls << url
          subdomains << subdomain
        end
      end
    end

    pool.shutdown
    pool.wait_for_termination

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
