# Museum Management REST API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-ORM-FF4785?style=flat-square" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/OpenAPI-3.0-6BA539?style=flat-square&logo=openapi-initiative&logoColor=white" alt="OpenAPI" />
  <img src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=flat-square" alt="Zod" />
  <img src="https://img.shields.io/badge/WebSocket-ws-010101?style=flat-square&logo=socket.io&logoColor=white" alt="WebSocket" />
</p>

<p align="center">
  <img src="public/assets/images/museum%20management%20api.png" alt="Museum Management API" width="100%" />
</p>

Production-ready REST API for a digital museum platform: content, auth, bookings, forum, and real-time features. Built with a **modular, microservice-friendly** design and standard Web API practices.

## Key features

| Capability | Description |
|------------|-------------|
| **RESTful API design** | Versioned base path (`/api/v1`), standard HTTP verbs (GET, POST, PUT, PATCH, DELETE), appropriate status codes (2xx, 4xx, 5xx), and JSON request/response bodies aligned with Web API best practices. |
| **Interactive API documentation** | OpenAPI 3.0 specification with Swagger UI at `GET /api-docs` and machine-readable spec at `GET /api-docs.json` for client generation and integration. |
| **Structured error handling** | Consistent JSON error payloads with `success`, `error.message`, `requestId`, `timestamp`, and `path`; 404 responses for unknown routes and predictable error semantics across all endpoints. |
| **Security & observability** | Helmet security headers, CORS policies, global and login-specific rate limiting, environment validation at startup, and health/live/ready probes for orchestration and monitoring. |
| **Testable architecture** | App factory pattern decouples app creation from server binding; unit and integration tests with automated CI pipeline (lint, typecheck, test, build). |

## Tech stack

| Layer      | Choice                               |
| ---------- | ------------------------------------ |
| Runtime    | Node.js 18+                          |
| Language   | TypeScript (strict)                  |
| Framework  | Express 4.x                          |
| Database   | PostgreSQL (local + Neon serverless) |
| ORM        | Drizzle ORM                          |
| Auth       | Passport.js (local), session-based   |
| Validation | Zod                                  |
| Security   | Helmet, CORS, rate limiting          |
| Real-time  | WebSocket (ws)                       |

## Architecture

- **Modular domains**: Each feature (history, gallery, bookings, forum, contact, admin, auth, users) lives in its own routes/controllers/services so domains can be split into microservices later.
- **App factory**: `createApp()` builds the Express app without starting the server for testability and clean process boundaries.
- **Env-first**: Config validated at startup via Zod; invalid env fails fast.
- **Structured errors**: Custom `AppError` types (e.g. `NotFoundError`, `ValidationError`) with correct HTTP status and consistent JSON error payloads including `requestId`.

## API base

All endpoints are under **`/api/v1`** (e.g. `GET /api/v1/health`).

| Area      | Examples                                                                               |
| --------- | -------------------------------------------------------------------------------------- |
| Health    | `GET /api/v1/health`                                                                   |
| Auth      | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/profile`    |
| History   | `GET /api/v1/histories`, `GET /api/v1/histories/:id`, `POST /api/v1/histories` (admin) |
| Gallery   | `GET /api/v1/gallery`, `GET /api/v1/gallery/category/:category`                        |
| Bookings  | `GET /api/v1/bookings`, `POST /api/v1/bookings`                                        |
| Forum     | `GET /api/v1/forum/posts`, `POST /api/v1/forum/posts`, `POST /api/v1/forum/likes`      |
| Contact   | `POST /api/v1/contact`                                                                 |
| Admin     | Admin-only routes under `/api/v1/admin`                                                |
| WebSocket | `/ws` on same server                                                                   |

Responses use a consistent shape: `{ success, data?, error?, message?, pagination?, requestId? }`. Errors include `requestId` and `timestamp`.

## Quick start

**Requirements:** Node.js 18+, pnpm 8+

```bash
git clone <repo-url>
cd repo_name
pnpm install
cp .env.example .env   # then set DATABASE_URL, SESSION_SECRET, FRONTEND_URL, etc.
pnpm run db:push       # or db:migrate
pnpm run dev           # http://localhost:5001
```

- **API base:** [http://localhost:5001/api/v1](http://localhost:5001/api/v1)
- **Interactive API docs (Swagger UI):** [http://localhost:5001/api-docs](http://localhost:5001/api-docs)
- **OpenAPI JSON:** [http://localhost:5001/api-docs.json](http://localhost:5001/api-docs.json)

**Important env vars**

| Variable            | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `DATABASE_URL`      | PostgreSQL URL (dev)                                  |
| `DATABASE_URL_PROD` | Production DB (e.g. Neon)                             |
| `SESSION_SECRET`    | Min 32 chars                                          |
| `FRONTEND_URL`      | Allowed CORS origin (default `http://localhost:3000`) |
| `CORS_ORIGINS`      | Optional comma-separated extra origins                |
| `PORT`              | Server port (default `5001`)                          |

## Scripts

| Command                                       | Purpose                                        |
| --------------------------------------------- | ---------------------------------------------- |
| `pnpm run dev`                                | Dev server with hot reload                     |
| `pnpm run build` / `pnpm start`               | Production build and run                       |
| `pnpm run check`                              | TypeScript check                               |
| `pnpm run test`                               | Unit + integration tests (includes CORS tests) |
| `pnpm run lint`                               | ESLint                                         |
| `pnpm run db:push` / `db:migrate` / `db:seed` | Database                                       |

## Security & performance

- **CORS**: Env-based allowed origins (no wildcard when using credentials); preflight and headers tested.
- **Helmet**: Security headers (CSP, HSTS, etc.).
- **Rate limiting**: Applied on login and sensitive routes.
- **Request tracing**: `X-Request-ID` on every response; structured logging with request IDs.
- **Health**: `/api/v1/health` returns DB status and version; 503 when DB is down.

## Testing

- Unit tests for services (e.g. history service).
- CORS tests: allowed origin gets `Access-Control-Allow-Origin`, preflight returns 204, disallowed origin rejected.
- Run: `pnpm test`.

## Deployment

- Build: `pnpm run build` then `node dist/index.js` (or `pnpm start`).
- Set `NODE_ENV=production`, `DATABASE_URL_PROD`, `API_PROD_URL`, and a strong `SESSION_SECRET`.
- Suitable for Node hosts (e.g. Render, Railway, Fly.io).

## Project structure

```
├── app.ts                 # Express app factory (no server listen)
├── index.ts               # Entry: env, createApp, registerRoutes, listen
├── config/                # Env, auth, CORS, DB, OpenAPI, security
├── middlewares/           # Request ID, rate limit, errors, not-found
├── server/
│   ├── routes/            # Route modules mounted under /api/v1
│   ├── controllers/       # Request/response handling
│   ├── services/          # Business logic
│   └── types/             # API response types
├── docs/                  # Feature summary, architecture notes
└── drizzle/               # Migrations
```

## License

MIT.
