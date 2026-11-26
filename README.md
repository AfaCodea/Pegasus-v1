# Pegasus-v1

A simple full-stack Task Manager — built as a learning project for software
engineering fundamentals (REST API, auth, relational data, containerized dev, CI).

**Stack:** Node.js + Express + TypeScript (server) · React + Vite + TypeScript (client) · PostgreSQL (db)

**Features:** email/password auth (JWT) · create, edit, filter and complete tasks
(title, description, status, due date) · per-user data isolation · integration-tested API.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full infrastructure breakdown.

## Quick start

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
docker-compose up --build
```

- Client: http://localhost:5173
- Server API: http://localhost:4000/api
- Postgres: localhost:5432 (user/pass/db: `pegasus`)

## Without Docker

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm run dev
```

You'll need a local Postgres instance and `server/.env` pointed at it
(see `server/src/db/schema.sql` for the schema).

## Scripts

| Location | Command | What it does |
|----------|---------|---------------|
| `server/` | `npm run dev` | Start API with hot reload |
| `server/` | `npm test` | Run server unit tests |
| `server/` | `npm run lint` / `npm run typecheck` | Lint / type-check |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm test` | Run client unit tests |

CI runs lint, typecheck, and tests for both `server` and `client` on every push (`.github/workflows/ci.yml`).
