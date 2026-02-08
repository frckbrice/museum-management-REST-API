/**
 * Application factory — creates Express app with middleware only (no routes).
 * No server.listen here: allows testing and microservice extraction.
 * Env must be validated before calling (e.g. by importing config/env first).
 * CORS is applied here so all routes benefit from origin validation and preflight.
 */
import express, { RequestHandler } from "express";
import type { ExpressApp, ExpressRequestLike, ExpressResponse } from "./types/express-app";
import cors from "cors";
import { env } from "./config/env/env-validation";
import { getCorsOptions } from "./config/cors/cors-options";
import { configureHelmet } from "./config/security/helmet-config";
import { requestIdMiddleware } from "./middlewares/request-id";
import { globalRateLimiter } from "./middlewares/global-rate-limit";
import { logger } from "./config/logger/logger-config";

export function createApp(): ExpressApp {
  const app = express() as unknown as ExpressApp;

  if (env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(requestIdMiddleware);
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: false, limit: "100mb" }));
  app.use(globalRateLimiter);

  app.use(cors(getCorsOptions()));
  configureHelmet(app);

  // Request logging (API routes only)
  const requestLoggingMiddleware: RequestHandler = (
    req: express.Request,
    res: express.Response,
    next: (err?: unknown) => void
  ) => {
    const logReq = req as unknown as ExpressRequestLike;
    const logRes = res as unknown as ExpressResponse;
    const start = Date.now();
    const path = logReq.path;
    let capturedBody: Record<string, unknown> | undefined;

    const originalJson = logRes.json.bind(res);
    logRes.json = function (body: unknown) {
      if (typeof body === "object" && body !== null) {
        capturedBody = body as Record<string, unknown>;
      }
      return originalJson(body);
    };

    logRes.on("finish", () => {
      if (path.startsWith("/api/")) {
        const duration = Date.now() - start;
        const meta = {
          method: logReq.method,
          path,
          status: logRes.statusCode,
          durationMs: duration,
          requestId: logReq.requestId,
        };
        if (logRes.statusCode >= 500) {
          logger.error("request", meta);
        } else if (logRes.statusCode >= 400) {
          logger.warn("request", meta);
        } else {
          logger.debug("request", capturedBody ? { ...meta, body: capturedBody } : meta);
        }
      }
    });
    next();
  };
  app.use(requestLoggingMiddleware);

  return app;
}
