# Installation

!!! info "OS Support"

    The [Hunt3r](https://github.com/EasyRecon/Hunt3r) installation has only been tested on Ubuntu 22.04 & Debian 11 with an x86 architecture.

!!! warning "Local installation"

    Hunt3r must be installed on an external VPS to work, a local installation will allow you to use the UI but your scans will not be able to upload information to the API

The installation of Hunt3r can be done in two ways:

- Quick with just the project setup available at [http://0.0.0.0](http://0.0.0.0)
- Complete with Traefik as reverse proxy to deliver an HTTPS certificate

## Quick Installation

Clone the Hunt3r Repository :

```bash
git clone https://github.com/EasyRecon/Hunt3r
cd Hunt3r
```

Modify the `.env` file taking care to indicate a JWT Robust secret, the `APP_URL` variable corresponds to your domain (ex: http://your_ip)

```bash
mv backend/.env.example backend/.env  
nano backend/.env
```

Launching the dockers

```docker
docker-compose run backend rake db:create
docker-compose run backend rake db:migrate
docker-compose run backend rake db:seed
```
    
## Complete Installation With SSL

To keep your installation clean enough and to be modular in case you want to have other dockers on your server exposed in HTTPS, we will use Traefik which is a reverse proxy for Docker.
It will redirect the traffic to the corresponding dockers and also deliver the HTTPS certificates via Let's Encrypt.

Before starting you will obviously need docker, docker-compose and to have two domain names pointing to your server

- traefik.domain.tld
- hunt3r.domain.tld

```bash
#!/bin/bash

apt-get update && apt-get upgrade -y
apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install docker-ce
curl -SL https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

mkdir /root/Traefik
cd /root/Traefik

wget -O docker-compose.yml https://docs.hunt3r.ovh/assets/files/docker-compose.traefik.yml
nano docker-compose.yml # Update 'traefik.domain.tld' line 23 with your custom subdomain

wget -O traefik.toml https://docs.hunt3r.ovh/assets/files/traefik.toml
nano traefik.tml # Update 'contact@domain.tld' line 16 with your email

mkdir letsencrypt
touch letsencrypt/acme.json
chmod 0600 letsencrypt/acme.json

mkdir logs

docker-compose up -d
```

Now clone the Hunt3r repository :

```bash
cd /root
git clone https://github.com/EasyRecon/Hunt3r
cd Hunt3r
```

Modify the `.env` file taking care to indicate a JWT Robust secret, the `APP_URL` variable corresponds to your domain (ex: https://hunt3r.domain.tld)

```bash
mv backend/.env.example backend/.env  
nano backend/.env
```

Get the configuration file with the Traefik directives

```bash
rm docker-compose.yml && wget -O docker-compose.yml https://docs.hunt3r.ovh/assets/files/docker-compose.hunt3r.yml
nano docker-compose.yml # Modify 'traefik.domain.tld' with your custom domain line 58
```

Launching the dockers

```docker
docker-compose run backend rake db:create
docker-compose run backend rake db:migrate
docker-compose run backend rake db:seed
```

## WebUI Access & Credentials

Once the Docker environment is up, you can access the application through the Web UI available on http://127.0.0.1 or https://hunt3r.domain.tld with the following default credentials :

- Email address : admin@admin.tld
- Password : password