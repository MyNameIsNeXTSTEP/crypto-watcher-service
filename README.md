# crypto-watcher-service
Тестовое задание Backend Engineer - бэкенд для публичного watcher-link (read-only)

## Timestamps
- Start: `Fri Oct 31 2025 15:08:22 GMT+0300 (Moscow Standard Time)`
- End: [YYYY-MM-DD HH:MM:SS]
- Duration: [X hours Y minutes]

## Tech Stack
- **Fastify**: High-performance web framework with built-in AJV validation
- **PG**: PostgreSQL lib for NodeJS
- **@fastify/rate-limit**: Per-token rate limiting (30 req/min)
- **JSON Schema**: Request/response validation and serialization
- **Base58Check**: Token encoding/decoding

## Quick Start
```bash
npm install
make up # Start a DB
make migrate # Run migrations
make generateTestData # Generate test token and hash data for a watcher API check

# ATTENTION
# After a succesfull test data generation, there would a log message with your { token & hash } pair
# Copy the token for further API call

make dev # Dev server start
make seed # Optional: create test data
```

## API Endpoints
- HTTP \`GET /public/w/:token/dashboard\` - Get dashboard data
- HTTP \`GET /healthz\` - Health check

## Key Features
1. **JSON Schema Validation**: All routes validated via Fastify's AJV integration based on TypeBox lib
2. **Type Safety**: Full TypeScript coverage
3. **Performance**: Fastify's fast JSON serialization + firect pg pool queries
4. **Rate Limiting**: Per-token limits with automatic cleanup
5. **ETag Support**: Canonical JSON with 60s timestamp granularity

## Architecture Decisions
- Plain SQL with pg lib over ORM: better dev-control over SQL, type-safe queries
- Custom migration and seeds script (**run.ts**): for all in one handling of raw sql operations
- @fastify/rate-limit: Production-ready (has a Redis support if needed). In our simple case with one app instance we don't use the Redis.
- JSON Schema: Request validation + response serialization in one (using **TypeBox**:w
 lib)
