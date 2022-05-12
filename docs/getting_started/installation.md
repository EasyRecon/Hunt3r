# Installation

!!! info ":computer: OS Support"

    The [Hunt3r](https://github.com/EasyRecon/Hunt3r) installation has only been tested on Ubuntu 22.04 & Debian 11 with an x86 architecture.

The installation of Hunt3r can be done in two ways:
- Quick with just the project setup available at [http://0.0.0.0](http://0.0.0.0)
- Complete with Traefik as a front-end reverse proxy to deliver an HTTPS certificate

## Fast Installation

Clone the Hunt3r Repository :

```bash
git clone https://github.com/EasyRecon/Hunt3r
```

Modify the `.env` file taking care to indicate a JWT Robust secret, the `APP_URL` variable corresponds to your domain (ex: https://hunt3r.domain.tld)

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

Once the Docker environment is up, you can access the application through the Web UI available on http://0.0.0.0 with the following default credentials :

- Email address : admin@admin.tld
- Password : password
    
## Complete Installation With SSL

:construction_site: Work In Progress  :construction_site: