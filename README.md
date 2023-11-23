# Group Meeting Email System

```
.
├── apache2
├── backend
├── Dockerfile
├── frontend
├── html
├── README.md
└── run.sh
```

`apache2` contains `apache2` config files, `backend` contains the backend code, `frontend` source code for frontend, `html` the built frontend.

## Before start
Please change the mail configuration [__init__.py](./backend/app/__init__.py), which is `TODO` now.

## build docker image
```shell
docker build --no-cache -t dkr_mail .
```

## Run container
```shell
docker run -it -d -p 8001:80 -p 5000:5000 dkr_mail
```
`8001` can be changed to any port you like

`5000` **DO NOT MODIFY**
