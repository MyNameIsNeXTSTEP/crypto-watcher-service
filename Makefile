.PHONY: migrate dev build down

migrate:
	NODE_ENV=development npx tsx src/db/run.ts migrate src/db/migrations/001_init.sql

seed:
	NODE_ENV=development npx tsx src/db/run.ts seed src/db/seeds/001_seed.sql

dev:
	npm run dev

down:
	docker-compose down -v

build:
	npm run build

up:
	docker-compose up --build -d

down:
	docker-compose down -v

generateTestData:
	npx tsx generateTestData.ts