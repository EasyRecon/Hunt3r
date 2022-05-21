class Amass
  def self.get_domains(domain = OPTIONS[:domain])
    prepare_config
    update_resolvers

    random = (0...8).map { rand(65..90).chr }.join

    cmd = 'amass enum'
    cmd += ' -active' if OPTIONS[:amass_active]
    cmd += " -d #{domain} -config #{config_path} -trf #{resolver_path}"
    cmd += " -o #{OPTIONS[:output]}/amass_#{random}_domains.txt"

    system(cmd)
  end
end

private

def prepare_config
  `sed -i -E 's;#?scripts_directory =.*;scripts_directory = /tmp/tools/amass/scripts/;' #{config_path}`
end

def config_path
  '/tmp/tools/amass/config.ini'
end

def update_resolvers
  system("wget https://raw.githubusercontent.com/proabiral/Fresh-Resolvers/master/resolvers.txt -O #{resolver_path}")
end

def resolver_path
  '/tmp/tools/resolvers.txt'
end
