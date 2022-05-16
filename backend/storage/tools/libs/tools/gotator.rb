class Gotator
  def self.permutation
    update_resolvers
    update_permutation_list

    cmd = "gotator -sub #{OPTIONS[:output]}/all_domains.txt"
    cmd += " -perm #{permutation_path} -depth 1 -numbers 10 -mindup -adv -md -silent"
    cmd += " > #{OPTIONS[:output]}/gotator.txt"

    system(cmd)

    cmd = "puredns resolve #{OPTIONS[:output]}/gotator.txt"
    cmd += " -r #{resolver_path}"
    cmd += " -w #{OPTIONS[:output]}/puredns.txt"

    system(cmd)
    merge_results
  end
end

private

def update_resolvers
  system("wget https://raw.githubusercontent.com/proabiral/Fresh-Resolvers/master/resolvers.txt -O #{resolver_path}")
end

def resolver_path
  '/tmp/tools/resolvers.txt'
end

def update_permutation_list
  system("wget https://gist.github.com/six2dez/ffc2b14d283e8f8eff6ac83e20a3c4b4/raw -O #{permutation_path}")
end

def permutation_path
  '/tmp/tools/permutations.txt'
end

def merge_results
  `cat #{OPTIONS[:output]}/all_domains.txt #{OPTIONS[:output]}/puredns.txt | sort -u >> #{OPTIONS[:output]}/tmp_domains.txt`
  `mv #{OPTIONS[:output]}/tmp_domains.txt #{OPTIONS[:output]}/all_domains.txt`
end
