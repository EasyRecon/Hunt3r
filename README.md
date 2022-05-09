<h1 align="center">  
  <img src="https://zupimages.net/up/22/15/rb47.png" alt="Hunt3r" width="600px">  
  <br>  
</h1>  

<p align="center">  
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-_red.svg"></a>  
<a href="https://github.com/EasyRecon/Hunt3r/issues"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat"></a>  
<a href="https://github.com/EasyRecon/Hunt3r"><img src="https://img.shields.io/badge/version-0.3-informational"></a>  

<p align="center">  
  <a href="#features">Features</a> •  
  <a href="#installation-instructions">Installation</a> •
  <a href="#documentation">Documentation</a>
</p>

# Features
- [X] User management
- [X] Providers management
  - [X] Scaleway
  - [ ] AWS
- [X] Connect another Hunt3r platform
- [X] Tools management
  - [X] Custom Amass config
  - [X] Custom Nuclei config
  - [X] Custom Nuclei templates management
  - [X] External API Key Management
- [X] BugBounty Platforms Integration
  - [X] YesWeHack
  - [X] Intigriti
  - [X] Hackerone
- [X] Platform programs / scopes synchronisation
  - [X] YesWeHack
  - [X] Intigriti
  - [X] Hackerone
- [X] Platform statistiques
  - [X] YesWeHack
  - [X] Intigriti
  - [X] Hackerone
- [X] Generate Intigriti Invoice
- [X] Servers management
  - [X] Show servers informations with cost
  - [X] Delete server
- [X] Notifications management
- [X] Scans management
  - [ ] Slack notifications during scan
  - [ ] Recon scan
    - [ ] Mesh Integration
    - [X] Amass / Amass Active
    - [ ] Get associated domains
    - [X] Get Leaks
    - [X] Port scan
    - [X] Domains probing
    - [X] Subdomains Filtering
    - [X] CDN Filtering
    - [X] Get All URLs
    - [X] Screenshots
    - [ ] Permutations
    - [X] Nuclei
      - [X] With all templates
      - [X] With custom templates
  - [X] Nuclei scan
    - [X] Scan specific domain with specific templates
    - [X] Scan specific domain with all templates
    - [X] Scan all domains with specific templates
    - [X] Scan all domains with all templates

# Installation Instructions

```bash
mv backend/.env.example backend/.env  
nano backend/.env
```

```docker
docker-compose run frontend npm install
docker-compose up --build
docker-compose run backend rake db:create
docker-compose run backend rake db:migrate
docker-compose run backend rake db:seed
```

# Documentation

Work In Progress