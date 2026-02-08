/**
 * CORS options factory — builds cors() options from env-driven allowed origins.
 * Used by the Express app to enforce origin allowlist; no wildcard when credentials are used.
 */
import { getAllowedOrigins } from "./allowed-origins";

/** HTTP methods allowed for cross-origin requests */
const CORS_ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
/** Request headers clients may send */
const CORS_ALLOWED_HEADERS = ["Content-Type", "Authorization", "X-Request-ID"];
/** Response headers exposed to the client */
const CORS_EXPOSED_HEADERS = ["X-Request-ID"];

/**
 * Returns CORS options for the Express cors middleware.
 * Origin is validated against getAllowedOrigins(); invalid origin triggers an error (handled by error middleware).
 */
export function getCorsOptions(): import("cors").CorsOptions {
  const allowedOrigins = getAllowedOrigins();
  return {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Origin not allowed by CORS"));
    },
    methods: CORS_ALLOWED_METHODS,
    allowedHeaders: CORS_ALLOWED_HEADERS,
    exposedHeaders: CORS_EXPOSED_HEADERS,
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  };
}
