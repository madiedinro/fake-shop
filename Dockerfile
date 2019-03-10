FROM php:7.2-cli-alpine

LABEL caddy.address=demo.stat.rock.dev
LABEL caddy.targetport=8080
LABEL caddy.targetprotocol=http
LABEL caddy.tls=off

COPY . /usr/src/fakeshop
WORKDIR /usr/src/fakeshop

CMD ["sh", "-c", "php -S 0.0.0.0:8080 -t public/  > /dev/null 2>&1"]
