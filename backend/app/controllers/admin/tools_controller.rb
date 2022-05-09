class Admin::ToolsController < ApplicationController
  before_action :authenticate_user, :admin?

  # GET /admin/tools
  def index
    @tools = Tool.all

    render status: 200, template: 'admin/tools/index'
  end

  # POST /admin/tools
  def create
    tool_data = params.require(:tool).permit(:name, infos: %i[config_value user api_key url webhook])
    tool = Tool.find_by_name(tool_data[:name].downcase)

    if tool.nil?
      tool = Tool.create(tool_data)
    else
      tool.update(tool_data)
    end

    unless tool.valid?
      tool.destroy
      return render status: 422, json: { message: tool.errors.objects.first.full_message, data: nil }
    end

    case tool.name
    when 'amass', 'nuclei'
      value = tool.infos['config_value']

      unless (tool.name == 'amass' && base64?(value)) || (tool.name == 'nuclei' && base64?(value) && yaml?(value))
        tool.destroy
        return render status: 422, json: { message: I18n.t('errors.controllers.admin.tools.not_valid'), data: nil }
      end

      write_config(tool.name, value)

      tool.save
      render status: 200, json: { message: I18n.t('success.controllers.admin.tools.created'), data: nil }
    when 'dehashed'
      unless dehashed_valid?(tool)
        tool.destroy
        return render status: 422, json: { message: I18n.t('errors.controllers.admin.tools.not_valid'), data: nil }
      end

      tool.save
      render status: 200, json: { message: I18n.t('success.controllers.admin.tools.created'), data: nil }
    when 'hunt3r_token'
      tool.save
      render status: 200, json: { message: I18n.t('success.controllers.admin.tools.created'), data: nil }
    when 'c99'
      unless c99_valid?(tool)
        tool.destroy
        return render status: 422, json: { message: I18n.t('errors.controllers.admin.tools.not_valid'), data: nil }
      end

      tool.save
      render status: 200, json: { message: I18n.t('success.controllers.admin.tools.created'), data: nil }
    when 'whoxy'
      unless whoxy_valid?(tool)
        tool.destroy
        return render status: 422, json: { message: I18n.t('errors.controllers.admin.tools.not_valid'), data: nil }
      end

      tool.save
      render status: 200, json: { message: I18n.t('success.controllers.admin.tools.created'), data: nil }
    when 'slack'
      unless slack_valid?(tool)
        tool.destroy
        return render status: 422, json: { message: I18n.t('errors.controllers.admin.tools.not_valid'), data: nil }
      end

      tool.save
      render status: 200, json: { message: I18n.t('success.controllers.admin.tools.created'), data: nil }
    when 'interactsh'
      unless interactsh_valid?(tool)
        tool.destroy
        return render status: 422, json: { message: I18n.t('errors.controllers.admin.tools.not_valid'), data: nil }
      end

      tool.save
      render status: 200, json: { message: I18n.t('success.controllers.admin.tools.created'), data: nil }
    else
      tool.destroy
      render status: 422, json: { message: I18n.t('errors.controllers.admin.tools.not_valid'), data: nil }
    end
  end

  def model
    render status: 200, template: 'admin/tools/model'
  end

  private

  def write_config(tool_name, value)
    path = case tool_name
           when 'amass'
             amass_config_path
           when 'nuclei'
             nuclei_config_path
           else
             return
           end

    dir = File.dirname(path)
    FileUtils.mkdir_p(dir) unless Dir.exist?(dir)

    decoded_value = Base64.decode64(value).force_encoding('UTF-8')
    File.write(path, decoded_value, mode: 'w+')
  end

  def amass_config_path
    File.join(Rails.root, 'storage', 'configs', 'tools', 'amass', 'config.ini')
  end

  def nuclei_config_path
    File.join(Rails.root, 'storage', 'configs', 'tools', 'nuclei', 'config.yaml')
  end

  def dehashed_valid?(tool)
    return false unless tool['infos']['user'] && tool['infos']['api_key']

    request = Typhoeus::Request.new(
      'https://api.dehashed.com/search?query=domain:hunt3r.ovh',
      userpwd: "#{tool['infos']['user']}:#{tool['infos']['api_key']}",
      headers: { 'Accept' => 'application/json' }
    )
    request.run
    response = request.response

    response&.code == 200 && JSON.parse(response.body)['balance'].positive?
  end

  def slack_valid?(tool)
    return false unless tool['infos']['webhook']

    request = Typhoeus::Request.new(
      tool['infos']['webhook'],
      method: :post,
      body: { text: 'Hunt3r Test' }.to_json,
      headers: { 'Content-Type': 'application/json' }
    )
    request.run
    response = request.response

    response&.code == 200 && response.body == 'ok'
  end
end

def interactsh_valid?(tool)
  return false unless tool['infos']['url']

  request = Typhoeus::Request.new(
    tool['infos']['url']
  )
  request.run
  response = request.response

  response.body.include?('<h1> Interactsh Server </h1>')
end

def c99_valid?(tool)
  return false unless tool['infos']['api_key']

  request = Typhoeus::Request.new(
    "https://api.c99.nl/passwordgenerator?key=#{tool['infos']['api_key']}&length=1&include=numbers&json"
  )
  request.run
  response = request.response

  response&.code == 200 && JSON.parse(response.body)['success']
end

def whoxy_valid?(tool)
  return false unless tool['infos']['api_key']

  request = Typhoeus::Request.new(
    "http://api.whoxy.com/?key=#{tool['infos']['api_key']}&account=balance"
  )
  request.run
  response = request.response

  response&.code == 200 && JSON.parse(response.body)['reverse_whois_balance']&.positive?
end
