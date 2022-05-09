class Amass
  def self.get_domains
    prepare_config
    update_resolvers

    if OPTIONS[:amass_active]
      cmd = "amass enum -active -config #{config_path} -d #{OPTIONS[:domain]} -trf #{resolver_path} -o #{OPTIONS[:output]}/amass_domains.txt"
    else
      cmd = "amass enum -config #{config_path} -d #{OPTIONS[:domain]} -trf #{resolver_path} -o #{OPTIONS[:output]}/amass_domains.txt"
    end

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
