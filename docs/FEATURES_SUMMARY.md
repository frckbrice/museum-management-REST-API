# Museum Management REST API — Features Summary

Summary of infrastructure and cross-cutting features for the **Museum Management REST API** (`museum-management-rest-api`).

---

## Completed features (merged to `main`)

### 1. Environment variable validation (Zod)

- **Location**: `config/env/env-validation.ts`
- **Purpose**: Validate all required env vars at startup with a Zod schema; app exits with clear errors if config is invalid.
- **Usage**: Import `env` from `./config/env/env-validation`; use `env.PORT`, `env.NODE_ENV`, etc. No raw `process.env` for validated keys.

### 2. Structured logging (Winston)

- **Location**: `config/logger/logger-config.ts`
- **Purpose**: Central Winston logger with levels, timestamps, and optional file/console transports.
- **Usage**: Import `logger` from `./config/logger/logger-config`; use `logger.info()`, `logger.error()`, etc. with structured metadata.

### 3. Security headers (Helmet.js)

- **Location**: `config/security/helmet-config.ts`
- **Purpose**: Apply secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.) via Helmet.
- **Usage**: Applied in `app.ts` via `configureHelmet(app)`.

### 4. Request ID / tracing middleware

- **Location**: `middlewares/request-id.ts`
- **Purpose**: Assign a unique `requestId` per request (or use `X-Request-ID` if provided); set on `req.requestId` and `X-Request-ID` response header for tracing.
- **Usage**: Applied early in `app.ts`; error handler and request logging include `requestId` when present.

### 5. Centralized configuration management

- **Location**: `config/` (env, auth, cors, database, bucket-storage, logger, security)
- **Purpose**: Single place for server, auth, CORS, DB, and other config; consumed via validated `env` and dedicated config modules.
- **Usage**: Entry point uses `createApp()` from `app.ts`; routes and services import from `config/` and `env`.

### 6. Standardized error responses

- **Location**: `middlewares/errors/error-response.ts`, `middlewares/errors/error-handler.ts`
- **Purpose**: Single JSON error shape and status codes across the API; `AppError` subclasses and central error handler produce consistent responses.
- **Usage**: Throw `ValidationError`, `NotFoundError`, `DatabaseError`, `UnauthorizedError`, `ForbiddenError` from controllers; use `sendErrorResponse(res, ...)` for one-off errors. Global handler in `index.ts` catches and formats all errors with `requestId`, `timestamp`, `path`.

---

## Application entry flow

1. **`index.ts`** — Entry point: validates env (imports `config/env/env-validation`), calls `createApp()`, calls `registerRoutes("/api/v1", app)` to mount routes and get the HTTP server, registers `errorHandler` middleware, then starts the server with `server.listen(PORT)`.
2. **`app.ts`** — Builds the Express app only (no listen): request-id → body parsers → CORS → Helmet → request logging (with `requestId` in logs). No routes mounted here.
3. **`server/routes/index.ts`** — `registerRoutes(basePath, app)` creates the HTTP server, attaches WebSocket server at `/ws`, configures auth, and mounts all route modules under `basePath` (e.g. `/api/v1`). Returns the same HTTP server so `index.ts` can call `listen()` on it.
4. **Routes** — Mounted under `/api/v1`; unhandled errors are caught by `middlewares/errors/error-handler.ts`, which returns a standardized JSON error (with `requestId`, `timestamp`, `path`).

---

## Additional features (implemented)

### 7. OpenAPI / Swagger

- **Location**: `config/openapi/spec.ts`, `server/routes/api-docs-route.ts`
- **Purpose**: Interactive API docs and machine-readable OpenAPI 3 spec.
- **Usage**: GET `/api-docs` for Swagger UI, GET `/api-docs.json` for the raw spec. Mounted in `registerRoutes` via `mountApiDocs(app)`.

### 8. Improved health checks

- **Location**: `server/controllers/health.controller.ts`, `server/routes/health-check-route.ts`
- **Purpose**: Liveness and readiness for orchestrators (e.g. Kubernetes).
- **Endpoints**: GET `/api/v1/health` (readiness, includes DB check), GET `/api/v1/live` (liveness, no DB), GET `/api/v1/ready` (alias for readiness).

### 9. Global rate limiting

- **Location**: `middlewares/global-rate-limit.ts`
- **Purpose**: App-wide rate limit per IP (e.g. 200 req/15 min). Health and `/api-docs` are skipped.
- **Usage**: Applied in `app.ts` via `globalRateLimiter`. Uses `express-rate-limit`; trust proxy in production.

### 10. Docker support

- **Location**: `Dockerfile`, `.dockerignore`
- **Purpose**: Multi-stage build for production image; run with `docker build -t museum-management-rest-api .` and pass env (e.g. `DATABASE_URL`, `SESSION_SECRET`) at runtime.

### 11. CI/CD pipeline

- **Location**: `.github/workflows/ci.yml`
- **Purpose**: On push/PR to main/master/develop: test, lint, typecheck, build; on push to main/master: build production artifact and Docker image (no push to registry by default; add secrets for deploy).

---

## Branch reference (historical)

These features were developed on branches and merged into `main`:

- `feature/config-management`
- `feature/env-validation`
- `feature/structured-logging`
- `feature/request-tracing`
- `feature/security-headers`

Further work should branch from `main`.
