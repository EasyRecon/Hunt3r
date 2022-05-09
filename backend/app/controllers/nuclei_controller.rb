class NucleiController < ApplicationController
  before_action :authenticate_user

  # GET /nuclei
  def index
    templates = Dir.entries("#{nuclei_templates_path}/").select { |f| f.end_with?('.yaml') }

    render status: 200, json: { message: nil, data: templates }
  end

  # POST /nuclei
  def create
    template_data = params.require(:template).permit(:name, :value)
    value = template_data[:value]

    unless base64?(value) && yaml?(value)
      return render status: 422, json: { message: I18n.t('errors.controllers.nuclei.not_valid'), data: nil }
    end

    path = nuclei_templates_path
    dir = File.dirname(path)
    FileUtils.mkdir_p(dir) unless Dir.exist?(dir)

    decoded_value = Base64.decode64(value).force_encoding('UTF-8')
    file = File.join(path, template_data[:name].gsub('..', '').downcase)
    file += '.yaml' unless file.end_with?('.yaml')

    File.write(file, decoded_value, mode: 'w+')

    render status: 200, json: { message: I18n.t('success.controllers.nuclei.created'), data: nil }
  end

  # DELETE /nuclei
  def destroy
    name = params[:name]
    name += '.yaml' unless name.end_with?('.yaml')

    path_to_file = File.join(nuclei_templates_path, name.gsub('..', ''))

    unless File.exist?(path_to_file)
      return render status: 422, json: { message: I18n.t('errors.controllers.nuclei.unknown'), data: nil }
    end

    File.delete(path_to_file) if File.exist?(path_to_file)

    render status: 200, json: { message: I18n.t('success.controllers.nuclei.deleted'), data: nil }
  end
end

private

def nuclei_templates_path
  File.join(Rails.root, 'storage', 'configs', 'tools', 'nuclei', 'templates')
end
