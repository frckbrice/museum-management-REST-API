# Museum Management REST API — multi-stage build (smallest image)
# =============================================================
# Stage 1: Dependencies and build
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY index.ts app.ts ./
COPY config config/
COPY middlewares middlewares/
COPY server server/
COPY drizzle.config.ts ./
COPY drizzle drizzle/

RUN pnpm run build

# Prune dev dependencies so runner only gets production node_modules
RUN pnpm prune --prod

# Stage 2: Production runner (minimal: no pnpm, no dev deps)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Copy only runtime artifacts from builder (no source, no devDependencies)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./

# Non-root user for security
RUN addgroup -g 1001 -S app && adduser -u 1001 -S app -G app
USER app

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]
