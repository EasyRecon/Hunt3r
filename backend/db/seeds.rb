# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

User.create(email: 'admin@admin.tld', role: 'admin', password: 'password')
Tool.create(name: 'hunt3r_token', infos: { api_key: SecureRandom.alphanumeric(32) })


## DEV DATA
scan = Scan.create(domain: 'www.domain.tld', state: 'Finished', type_scan: 'recon', meshs: false, instance_type: 'DEV1-S', provider: 'Scaleway', notifs: false, active_recon: false, intel: false, leak: false, nuclei: true, all_templates: false, custom_templates: ['xxx'], permutation: false, gau: true)
domain = Domain.create(name: 'domain.tld', scan_id: scan.id)
Domain.create(name: 'domain2.tld', scan_id: scan.id)
Server.create(uid: 'xzyzjzjz', name: 'sqdqdqsd', ip: '1.1.1.1', state: 'Running', scan_id: scan.id)

Leak.create(username: 'toto', email: 'toto@domain.tld', password: '12345', domain_id: domain.id)
Leak.create(username: 'titi', email: 'titi@domain.tld', password: '12345', domain_id: domain.id)

subdomain = Subdomain.create(url: 'https://www.domain.tld', domain_id: domain.id, infos: {ip: '1.1.1.1', cname: nil, title: nil, location: nil, body_hash: 'b16e15764b8bc06c5c3f9f19bc8b99fa48e7894aa5a6ccdad65da49bbf564793', status_code: 404, content_length: 1337, ports: [80,443], technologies: ['PHP'], cdn: 'cloudflare'})
subdomain2 = Subdomain.create(url: 'https://www2.domain.tld', domain_id: 1, infos: {ip: '1.1.1.1', cname: 'www.domain.tld', title: 'Lorem Ipsum', location: nil, body_hash: 'b16e15764b8bc06c5c3f9f19bc8b99fa48e7894aa5a6ccdad65da49bbf564793', status_code: 200, ports: [80,443], content_length: 1337, technologies: ['PHP'], cdn: 'cloudflare'})

Screenshot.create(subdomain_id: 1, screenshot: 'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGklEQVQokWNkYGD4z0ACYCJF8aiGUQ1DSwMAPTEBH6oMxWYAAAAASUVORK5CYII=')
Screenshot.create(subdomain_id: 2, screenshot: 'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGklEQVQokWNkYGD4z0ACYCJF8aiGUQ1DSwMAPTEBH6oMxWYAAAAASUVORK5CYII=')

Vulnerability.create(name: 'Lorem Ipsum', severity: 'info', matched_at: 'https://www2.domain.tld/xyz')
Vulnerability.create(name: 'Lorem Ipsum', severity: 'critique', matched_at: 'https://www2.domain.tld/xyz')

Url.create(url: 'https://www.domain.tld/path1', status_code: 200, content_length: 1337, subdomain_id: subdomain.id)
Url.create(url: 'https://www.domain.tld/path2', status_code: 400, content_length: 1337, subdomain_id: subdomain.id)
Url.create(url: 'https://www.domain.tld/path3', status_code: 403, content_length: 1337, subdomain_id: subdomain.id)
Url.create(url: 'https://www.domain.tld/path1', status_code: 302, content_length: 1337, subdomain_id: subdomain2.id)

Notification.create(type_message: 'danger', message: 'Lorem Ipsum ...')
Notification.create(type_message: 'danger', message: 'Lorem Ipsum 2 ...')
Notification.create(type_message: 'danger', message: 'Lorem Ipsum 3 ...')
