.PHONY: dev stop reset-db install build typecheck lint test clean

dev:
	docker compose up -d
	pnpm turbo dev

stop:
	docker compose down

reset-db:
	docker compose down -v
	docker compose up -d postgres

install:
	pnpm install

build:
	pnpm turbo build

typecheck:
	pnpm turbo typecheck

lint:
	pnpm turbo lint

test:
	pnpm turbo test

clean:
	pnpm turbo clean
