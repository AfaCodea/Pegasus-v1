# Pegasus-v1 — Architecture

A simple full-stack **Task Manager** app, built as a learning project for software
engineering fundamentals: REST API design, auth, relational data modeling,
containerized local dev, and CI.

## Components

```
┌─────────────┐      HTTPS/JSON      ┌──────────────┐      SQL      ┌──────────────┐
│   Client     │ ───────────────────▶│   Server      │ ────────────▶│  PostgreSQL   │
│ React + Vite │◀─────────────────── │ Node/Express  │◀──────────── │   Database    │
└─────────────┘                      └──────────────┘               └──────────────┘
      │                                     │
      │                                     ├─ JWT auth middleware
      │                                     ├─ Task CRUD routes
      │                                     └─ Request validation (zod)
      │
      └─ Calls server via /api/*, stores JWT in memory
```

## Stack

| Layer      | Tech                                    | Why |
|------------|------------------------------------------|-----|
| Frontend   | React 18 + Vite + TypeScript             | Fast dev loop, industry-standard |
| Backend    | Node.js 20 + Express + TypeScript        | Simple, widely used, easy to reason about |
| Database   | PostgreSQL 16                            | Relational data (users, tasks), ACID |
| Auth       | JWT (access token), bcrypt for passwords | Standard stateless auth pattern |
| Local dev  | Docker Compose                           | One command spins up db + server + client |
| CI         | GitHub Actions                           | Lint + typecheck + test on every push/PR |

## Services (docker-compose)

- **db**: Postgres 16, persisted volume, seeded via `server/src/db/schema.sql`
- **server**: Express API on port `4000`, connects to `db`, hot-reload via `ts-node-dev`
- **client**: Vite dev server on port `5173`, proxies `/api` to `server`

## Data model (v1)

- `users (id, email, password_hash, created_at)`
- `tasks (id, user_id -> users.id, title, description, status, due_date, created_at, updated_at)`

## API surface (v1)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks` (auth required)
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Environments

- **Local**: `docker-compose up` — everything on localhost, `.env` from `.env.example`
- **CI**: GitHub Actions runs lint, typecheck, and unit tests on `server` and `client`
- **Future**: deploy target left open — e.g. Fly.io/Render for `server` + managed Postgres,
  Vercel/Netlify for `client`. Not provisioned yet; add when you're ready to deploy.

## Why this shape

This mirrors a typical small SaaS: separate client/server, a real relational DB,
token-based auth, containerized local dev, and CI from day one — the same shape
you'd use for a much bigger app, just with one resource (`tasks`) to keep the
learning curve manageable.
