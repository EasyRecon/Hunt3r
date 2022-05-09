class ApplicationController < ActionController::API
  include AuthenticateRequest
  before_action :current_user

  def hunt3r_token_valid?(token)
    current_key = Tool.find_by(name: 'hunt3r_token')

    if current_key.nil?
      false
    else
      token == current_key.infos['api_key']
    end
  end

  # TODO : See if it can be implemented in a cleaner way on another file
  def server_delete(server)
    server.destroy
    server.scan.update(state: 'Stopped')

    if server.name.downcase.start_with?('scw-')
      Thread.start { `scw instance server terminate #{server.uid} with-ip=true` }
    end
  end

  def base64?(value)
    value.is_a?(String) && Base64.strict_encode64(Base64.decode64(value)) == value
  end

  def yaml?(value)
    begin
      YAML.load(Base64.decode64(value))
      true
    rescue Psych::SyntaxError
      false
    end
  end
end
