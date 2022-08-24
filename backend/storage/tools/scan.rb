#!/usr/bin/env ruby
require 'optparse'
require 'typhoeus'
require 'json'
require 'base64'
require 'public_suffix'

require_relative 'libs/hunt3r_dashboard'
require_relative 'libs/slack'
require_relative 'libs/recon_scan'
require_relative 'libs/nuclei_scan'

require_relative 'libs/tools/amass'
require_relative 'libs/tools/assetfinder'
require_relative 'libs/tools/c99'
require_relative 'libs/tools/dehashed'
require_relative 'libs/tools/gau'
require_relative 'libs/tools/mesh'
require_relative 'libs/tools/nuclei'
require_relative 'libs/tools/wappago'
require_relative 'libs/tools/whois'
require_relative 'libs/tools/whoxy'

OPTIONS = {}

optparse = OptionParser.new do |opts|
  opts.banner = 'Usage: recon.rb [options]'

  opts.on('-h', '--help', 'Display this screen') do
    puts opts
    exit
  end

  opts.on('--scan-id id', 'ScanID') do |value|
    OPTIONS[:scan_id] = value
  end

  opts.on('--server-uid uid', 'Server UID') do |value|
    OPTIONS[:srv_uid] = value
  end

  opts.on('--hunt3r-token token', 'Secret Token for requests to the dashboard') do |value|
    OPTIONS[:hunt3r_token] = value
  end

  opts.on('--url value', 'Dashboard URL') do |value|
    OPTIONS[:url] = File.join(value, '/api')
  end

  opts.on('-d', '--domain domain', 'Domain to scan') do |value|
    OPTIONS[:domain] = value
  end

  opts.on('--amass-active true|false', 'If Amass enum in active mode should be used') do |v|
    OPTIONS[:amass_active] = v
  end

  opts.on('--type-scan type', 'Type of scan (Recon or Nuclei)') do |value|
    OPTIONS[:type_scan] = value
  end

  opts.on('--intel true|false', 'Search for related domains') do |v|
    OPTIONS[:intel] = v
  end

  opts.on('--whoxy-token token', 'Whoxy API Key Token') do |value|
    OPTIONS[:whoxy_token] = value
  end

  opts.on('--c99-token token', 'C99 API Key token') do |value|
    OPTIONS[:c99_token] = value
  end

  opts.on('-l', '--leak true|false', 'Search for a leak for the scanned domain') do |v|
    OPTIONS[:leak] = v
  end

  opts.on('--dehashed-username email', 'Dehashed user email') do |value|
    OPTIONS[:dehashed_username] = value
  end

  opts.on('--dehashed-token token', 'Dehashed user token') do |value|
    OPTIONS[:dehashed_token] = value
  end

  opts.on('--nuclei true|false', 'Search for vulnerabilities with Nuclei') do |v|
    OPTIONS[:nuclei] = v
  end

  opts.on('--nuclei-all-templates true|false', 'Use Nuclei all templates') do |v|
    OPTIONS[:nuclei_all_templates] = v
  end

  opts.on('--nuclei-custom-templates templates', 'Custom templates to use') do |value|
    OPTIONS[:nuclei_custom_templates] = value
  end

  opts.on('--nuclei-severity info', 'Specify the severity of templates to use') do |value|
    OPTIONS[:nuclei_severity] = value
  end

  opts.on('--interactsh-url url', 'Custom InteractSH URL') do |value|
    OPTIONS[:interactsh_url] = value
  end

  opts.on('--interactsh-token token', 'Custom InteractSH URL Token') do |value|
    OPTIONS[:interactsh_token] = value
  end

  opts.on('--permutation true|false', 'Subdomains permutation') do |v|
    OPTIONS[:permutation] = v
  end

  opts.on('--gau true|false', 'Recovery of valid URLs with GAU') do |v|
    OPTIONS[:gau] = v
  end

  opts.on('--slack webhook', 'Sends scan information to Slack') do |value|
    OPTIONS[:slack] = value
  end

  opts.on('--meshs true|false', 'Query meshs to retrieve subdomains data') do |v|
    OPTIONS[:meshs] = v
  end

  opts.on('--excludes regex', 'Regex list for subdomain exclusion') do |value|
    OPTIONS[:excludes] = value
  end

  opts.on('--concurrency 1', 'Concurrency multiplier') do |value|
    OPTIONS[:concurrency] = value.to_i
  end
end

begin
  optparse.parse!
rescue OptionParser::InvalidOption
  puts 'See scan.rb -h'
  exit
end

OPTIONS[:output] = '/tmp/scan/results'
OPTIONS.freeze

## Minimum information required
unless OPTIONS[:hunt3r_token] && OPTIONS[:scan_id] && OPTIONS[:srv_uid] && OPTIONS[:domain] && OPTIONS[:url] && OPTIONS[:type_scan]
  puts 'See scan.rb -h'
  InteractDashboard.send_notification('danger', 'One of the required parameters is missing to launch the scan')
  return
end

ReconScan.start if OPTIONS[:type_scan] == 'recon'
NucleiScan.start if OPTIONS[:type_scan] == 'nuclei'

## Send a notification and we delete the server
InteractDashboard.update_scan_status('Finished')
InteractDashboard.delete_server
