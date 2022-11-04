<h1 align="center">  
  <img src="https://zupimages.net/up/22/15/rb47.png" alt="Hunt3r" width="600px">  
  <br>  
</h1>  

<p align="center">  
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-_red.svg"></a>  
    <a href="https://github.com/EasyRecon/Hunt3r/issues"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat"></a>  
    <a href="https://github.com/EasyRecon/Hunt3r"><img src="https://img.shields.io/badge/release-v1.6.4-informational"></a>
    <a href="https://github.com/easyrecon/hunt3r/issues" target="_blank"><img src="https://img.shields.io/github/issues/easyrecon/hunt3r?color=blue" /></a>
</p>

<p align="center">  
    <a href="https://codeclimate.com/github/EasyRecon/Hunt3r"><img src="https://codeclimate.com/github/EasyRecon/Hunt3r.png"></a>
    <a href="https://github.com/easyrecon/hunt3r/actions/workflows/codeql-analysis.yml"><img src="https://github.com/easyrecon/hunt3r/actions/workflows/codeql-analysis.yml/badge.svg"></a>
</p>

<p align="center">
  <a href="#installation-instructions">Quick Installation</a> •
  <a href="#preview">Preview</a> •
  <a href="https://docs.hunt3r.ovh">Documentation</a>
</p>

# Quick Installation Instructions

```docker
docker-compose up --build
docker-compose run backend rake db:create
docker-compose run backend rake db:migrate
docker-compose run backend rake db:seed
```

Once the Docker environment is up, you can access the application through the Web UI available on [http://0.0.0.0](http://0.0.0.0) with the following default credentials :
- Email address : `admin@admin.tld`
- Password : `password`

# Preview

| Light Dashboard | Dark Dashboard |
:---:|:---:
![](docs/assets/images/light_dashboard.png) | ![](docs/assets/images/dark_dashboard.png)
| Platform statistics | Tools Settings |
![](docs/assets/images/BBStats.png) | ![](docs/assets/images/install_amass.png)
| Meshs management | Domains pages |
![](docs/assets/images/meshs_management.png) | ![](docs/assets/images/domains.png)
| Scans | Vulnerabilities |
![](docs/assets/images/scans.png) | ![](docs/assets/images/vulnerabilities.png)
| Programs | Scopes |
![](docs/assets/images/programs.png) | ![](docs/assets/images/scopes.png)
| Subdomains | Leaks |
![](docs/assets/images/subdomains.png) | ![](docs/assets/images/leaks.png)
| Engines | Launch scan |
![](docs/assets/images/engines.png) | ![](docs/assets/images/create_scan.png)