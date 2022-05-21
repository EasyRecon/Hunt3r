class Amass
  def self.get_domains
    prepare_config
    update_resolvers

    cmd = 'amass enum'
    if OPTIONS[:amass_active]
      cmd += ' -active'

      if OPTIONS[:permutation]
        update_permutation_list
        cmd += " -aw #{permutation_path}"
      end
    end
    cmd += " -d #{OPTIONS[:domain]} -config #{config_path} -trf #{resolver_path}"
    cmd += " -o #{OPTIONS[:output]}/amass_domains.txt"

    system(cmd)
  end

  def self.recursive_check(domain)
    random = (0...8).map { rand(65..90).chr }.join

    cmd = 'amass enum'
    cmd += " -d #{domain} -config #{config_path} -trf #{resolver_path}"
    cmd += " -o #{OPTIONS[:output]}/amass_#{random}_domains.txt"

    system(cmd)
  end
end

private

def update_permutation_list
  system("wget https://gist.github.com/six2dez/ffc2b14d283e8f8eff6ac83e20a3c4b4/raw -O #{permutation_path}")
end

def permutation_path
  '/tmp/tools/permutations.txt'
end

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
