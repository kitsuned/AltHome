.DEFAULT_GOAL: all
.PHONY: agent

agent:
	$(MAKE) -C agent all

frontend-install:
	yarn install

frontend:
	yarn webpack --mode production

pack:
	yarn webpack -c ./webpack.ares.ts

all: frontend-install frontend agent pack
