class Slack
  def self.notify(message)
    return unless OPTIONS[:slack] && message

    Typhoeus::Request.post(
      OPTIONS[:slack],
      body: { text: message }.to_json,
      headers: { 'Content-Type': 'application/json' }
    )
  end
end
