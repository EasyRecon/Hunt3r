class Mesh
  def self.get_domains
    meshs = File.read('/tmp/meshs.txt')
    meshs_json = JSON.parse(meshs)
    meshs_json.each do |mesh|
      random = (0...8).map { rand(65..90).chr }.join
      subdomains = get_mesh_domains(mesh['url'], mesh['token'])
      next if subdomains.nil?

      File.open("#{OPTIONS[:output]}/#{random}_mesh_domains.txt", 'w+') do |f|
        f.puts(subdomains)
      end
    end
  end
end

private

def get_mesh_domains(url, token)
  response = Typhoeus::Request.post(
    File.join(url, 'api/domains/mesh'),
    body: { meshs: { url: OPTIONS[:url], token: token, domain: OPTIONS[:domain] } }.to_json,
    headers: { 'Content-Type' => 'application/json' }
  )
  return unless response&.code == 200

  JSON.parse(response.body)['data']
end
