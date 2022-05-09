<h1 align="center">  
  <img src="https://zupimages.net/up/22/15/rb47.png" alt="Hunt3r" width="600px">  
  <br>  
</h1>  

<p align="center">  
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-_red.svg"></a>  
<a href="https://github.com/EasyRecon/Hunt3r/issues"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat"></a>  
<a href="https://github.com/EasyRecon/Hunt3r"><img src="https://img.shields.io/badge/release-v1.0.0-informational"></a>
<a href="https://codeclimate.com/github/EasyRecon/Hunt3r"><img src="https://codeclimate.com/github/EasyRecon/Hunt3r.png"></a>

<p align="center">  
  <a href="#features">Features</a> •  
  <a href="#installation-instructions">Installation</a> •
  <a href="https://docs.hunt3r.ovh">Documentation</a>
</p>

# Features
- [X] User management
- [X] Cloud Providers management
- [X] Connect another Hunt3r platform
- [X] Tools management
- [X] BugBounty Platforms Integration
- [X] Platform programs / scopes synchronisation
- [X] Platform statistiques
- [X] Generate Intigriti Invoice
- [X] Servers management
- [X] Notifications management
- [X] Scans management

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