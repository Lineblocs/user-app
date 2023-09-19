# Use Docker Compose to develop lineblocs

## Structure of directory
```shell
.
├── apache.conf
├── app
├── bitbucket-pipelines.yml
├── bower_components
├── bower.json
├── dev
|    ├── docker-compose.full.yml
|    ├── docker-compose.yml
|    ├── mysql
|    │   └── dbinitial
|    └── README.md
├── dist
├── Dockerfile
├── favicon.png
├── gulpfile.js
├── __MACOSX
├── merge_templates.js
├── node_modules
├── npm-shrinkwrap.json
├── package.json
├── package-lock.json
├── ports.conf
├── README.md
├── scripts
└── shell_scripts
```

## Simple running
```shell
$ git clone https://github.com/Lineblocs/user-app.git
$ cd user-app/dev
$ cp .env.example .env
$ docker compose --profile enable_proxy up -d
```
 Open web browser 
`http://127.0.0.1:8787`   -> `user-app lineblocs`

## Advance running

### Clone user-app project 
Clone docker compose and move to directory.
```shell
$ git clone https://github.com/Lineblocs/user-app.git
$ cd user-app/dev
```

### Make .env file and confige
```shell
$ cp .env.example .env
```
`DEPLOYMENT_DOMAIN` -> base domain 
`APP_PORT_HOST` -> Port to publish application on host interface

`CONFIG_DB_HOST` -> is host of database. While using mysql on container. Set this value to name of container service.
`DB_USERNAME` -> username of database
`CONFIG_DB_PASSWORD` -> password of database user.
`CONFIG_DB_ROOT_PASSWORD` -> password of root user
`CONFIG_DB_DATABASE` -> database name
`CONFIG_DB_PORT` -> database port on mysql container
`CONFIG_DB_OPENSIPS_DATABASE` -> opensips database name
`MYSQL_PORT_HOST` -> Port of host mapping to mysql container on 3306

`VERSION` -> version image of lineblocs site and editor

While want to access website with `DEPLOYMENT_DOMAIN`, after set `DEPLOYMENT_DOMAIN`. Don't forget tp change hosts file local machine. On linux file exists at /etc/hosts. On windows file exist at c:\Windows\System32\Drivers\etc\hosts. Add `127.0.0.1` -> `DEPLOYMENT_DOMAIN`  ;  `127.0.0.1` -> `app.DEPLOYMENT_DOMAIN`


###  create container
Create and run container with this command below. 
`--profile enable_proxy` use for create nginx as proxy. Remove `--profile enable_proxy` while won't create nginx as proxy. While use nginx as proxy, must confige local hosts with DEPLOYMENT_DOMAIN. 

```shell
$ docker compose --profile enable_proxy up -d
```

### Access lineblocs
Lineblocs-user-app -> http://127.0.0.1:{APP_PORT_HOST}  without `--profile enable_proxy`

Lineblocs-user-app -> http://app.{DEPLOYMENT_DOMAIN}  with `--profile enable_proxy`

Please remember use http, because on docker compose confige disable https.

### Useful command
Check node log  `docker logs lineblocs-user-app`

Log in to terminal of container  -> `docker exec -it lineblocs-user-app bash`

Modify lineblocs-site project under `user-app/app` or check config on gulpfile.js

Use `docker logs -f lineblocs-user-app` to track file modification. If file content changed (*.js, *.html or *.css) but nothing happen on web browser, Please run `docker compose restart`
### Note
Please remember, lineblocs app integrated with lineblocs editor and libeblocs site. So make sure can access https://lineblocs.com and https://editor.lineblocs.com
