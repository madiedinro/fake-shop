BR := $(shell git branch | grep \* | cut -d ' ' -f2-)
bump-patch:
	bumpversion patch

bump-minor:
	bumpversion minor

build:
	docker build -t madiedinro/fake-shop .

deploy:
	rsync -a  --exclude=composer.phar --exclude=.git --exclude=bower_components --exclude=node_modules . root@front.nktch.com:/srv/www/demo

run:
	@docker rm -f fake-shop || true
	@docker run --name fake-shop -d -e DOMAIN=stat.rock.dev --restart on-failure -p 127.0.0.1:9010:9000 madiedinro/fake-shop

to_master:
	@echo $(BR)
	git checkout master && git rebase $(BR) && git checkout $(BR)

push:
	git push origin master
	git push origin dev
