class Nuclei
  def self.check_domains(file = 'httpx')

    if OPTIONS[:nuclei_all_templates] && OPTIONS[:nuclei_custom_templates]
      update_templates
      copy_custom_templates
    elsif OPTIONS[:nuclei_all_templates]
      update_templates
    else
      copy_custom_templates
    end

    cmd = "nuclei -l #{OPTIONS[:output]}/#{file}.txt -silent -t #{templates_path}"
    cmd += " -severity #{OPTIONS[:nuclei_severity]}" if OPTIONS[:nuclei_severity]

    if OPTIONS[:interactsh_url]
      cmd += " -iserver #{OPTIONS[:interactsh_url]}"
      cmd += " -token #{OPTIONS[:interactsh_token]}" if OPTIONS[:interactsh_token]
    end

    cmd += " -json -o #{OPTIONS[:output]}/nuclei.json"

    system(cmd)
    parse_result
  end
end

private

def parse_result
  results = File.open("#{OPTIONS[:output]}/nuclei.json").read
  results.each_line do |line|
    line_json = JSON.parse(line)
    next unless line_json.is_a?(Hash) && !line_json.empty?

    name = line_json['info']['name']
    severity = line_json['info']['severity']
    matched_at = line_json['matched-at']

    next unless name && severity && matched_at

    InteractDashboard.send_vulnerability(name, severity, matched_at)
  end
end

def update_templates
  system("nuclei --update-templates --update-directory #{templates_path} -silent")
end

def templates_path
  '/tmp/scan/nuclei-templates'
end

def copy_custom_templates
  dest_folder = "#{templates_path}/customs/"
  FileUtils.mkdir_p(dest_folder)

  templates_dir = '/tmp/tools/nuclei/templates/'

  Dir.foreach(templates_dir) do |filename|
    next if %w[. ..].include?(filename)

    wanted_templates = OPTIONS[:nuclei_custom_templates].split
    next unless wanted_templates.any? { |template| template == filename || "#{template}.yaml" == filename }

    FileUtils.cp("#{templates_dir}/#{filename}", "#{dest_folder}/#{filename}")
  end
end
