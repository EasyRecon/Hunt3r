class Assetfinder
  def self.intel
    system("assetfinder #{OPTIONS[:domain]} | sort -u > #{OPTIONS[:output]}/assetfinder_intel.txt")

    Whois.check('assetfinder')
  end
end
