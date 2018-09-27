FROM php:7.2-cli-alpine

COPY . /usr/src/fakeshop
WORKDIR /usr/src/fakeshop

WORKDIR /usr/src/fakeshop

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public/"]

