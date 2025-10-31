.PHONY: migrate dev build down

migrate:
	NODE_ENV=development npx tsx src/db/migrate.ts

dev:
	docker-compose up --build -d
	npm run dev

build:
	npm run build

down:
	docker-compose down -v
