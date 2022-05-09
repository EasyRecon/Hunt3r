class Slack
  def self.notify(message)
    return unless OPTIONS[:slack] && message

    request = Typhoeus::Request.new(
      OPTIONS[:slack],
      method: :post,
      body: { text: message }.to_json,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
  end
end
