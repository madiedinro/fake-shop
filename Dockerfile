FROM php:7.2-cli-alpine

COPY . /usr/src/fakeshop
WORKDIR /usr/src/fakeshop

CMD ["sh", "-c", "php -S 0.0.0.0:8080 -t public/  > /dev/null 2>&1"]
