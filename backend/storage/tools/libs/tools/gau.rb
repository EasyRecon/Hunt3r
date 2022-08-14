class Gau
  def self.get_urls
    data = File.read("#{OPTIONS[:output]}/wappago.txt")

    data.each_line do |url|
      url.chomp!
      valid_urls = Set[]

      random = (0...8).map { rand(65..90).chr }.join
      `gau --blacklist png,jpg,jpeg,gif,svg,js,css,ttf,woff,woff2,icon,tiff --o #{OPTIONS[:output]}/gau_#{random}.txt #{url}`

      gau_results = File.open("#{OPTIONS[:output]}/gau_#{random}.txt").read
      gau_results.each_line do |line|
        httpx_result = `echo "#{line.chomp}" | httpx --silent -fc 404 --status-code --content-length -json`
        next if httpx_result.empty?

        httpx_result_json = JSON.parse(httpx_result)

        next unless httpx_result_json.is_a?(Hash)
        next if httpx_result_json['status-code'] == 404 # We don't care about the URL if it's a 404

        valid_urls << {
          url: httpx_result_json['url'],
          status_code: httpx_result_json['status-code'],
          content_length: httpx_result_json['content-length']
        }
      end

      InteractDashboard.send_urls(url, valid_urls.to_a)
    end
  end
end
