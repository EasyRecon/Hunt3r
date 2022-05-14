class Dehashed
  def self.get_leak
    return unless OPTIONS[:dehashed_username] && OPTIONS[:dehashed_token]

    # We limit ourselves to 5000 entries dehashed max to not explode the DB and burn all the API keys
    response = Typhoeus::Request.get(
      "https://api.dehashed.com/search?query=domain:#{OPTIONS[:domain]}&size=5000",
      userpwd: "#{OPTIONS[:dehashed_username]}:#{OPTIONS[:dehashed_token]}",
      headers: { 'Accept' => 'application/json' }
    )
    return unless response&.code == 200

    dehashed_leaks = JSON.parse(response.body)
    return unless dehashed_leaks.is_a?(Hash) && !dehashed_leaks['entries'].nil?

    leaks = Set[]
    dehashed_leaks['entries'].each do |leak|
      next if leak['password'].empty?

      leaks << { username: leak['username'], email: leak['email'], password: leak['password'] }
    end
    return if leaks.empty?

    InteractDashboard.send_leaks(leaks.to_a)
  end
end
