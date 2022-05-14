class Naabu
  def self.check_domains
    cmd = "naabu -l #{OPTIONS[:output]}/all_domains.txt -tp -ec -c 2 -silent -json -o #{OPTIONS[:output]}/naabu.json"
    system(cmd)

    return unless File.zero?("#{OPTIONS[:output]}/naabu.json")

    InteractDashboard.send_notification('danger', "ScanID : #{OPTIONS[:scan_id]} | The file naabu.json is empty")
    InteractDashboard.delete_server
  end

  # Normalize data for HTTPX and avoid duplication
  # See https://github.com/projectdiscovery/naabu/issues/307
  def self.normalize
    data = {}
    File.readlines("#{OPTIONS[:output]}/naabu.json").each do |line|
      line = JSON.parse(line)

      data[line['host']] = { ip: line['ip'], ports: [] } unless data.key?(line['host'])
      data[line['host']][:ports] << line['port'] unless data[line['host']][:ports].include?(line['port'])
    end

    File.open("#{OPTIONS[:output]}/naabu.json", 'w+') do |f|
      f.write(data.to_json)
    end
  end
end
