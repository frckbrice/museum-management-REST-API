import { env } from "../env/env-validation";

/**
 * Allowed CORS origins — derived from env (FRONTEND_URL, CORS_ORIGINS, API_PROD_URL).
 * No wildcard when credentials are used; used by getCorsOptions() for origin validation.
 */
export function getAllowedOrigins(): string[] {
  const origins: string[] = [env.FRONTEND_URL];
  const extra = env.CORS_ORIGINS;
  if (extra) {
    origins.push(
      ...extra
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean)
    );
  }
  if (env.API_PROD_URL) {
    origins.push(env.API_PROD_URL);
  }
  return [...new Set(origins)];
}
