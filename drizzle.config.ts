import { defineConfig, Config } from "drizzle-kit";
import { env } from "./config/env/env-validation";

if (!env.DATABASE_URL_PROD && !env.DATABASE_URL) {
  throw new Error("Either DATABASE_URL or DATABASE_URL_PROD must be set. Ensure the database is provisioned");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./config/database/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL_PROD || env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
}) satisfies Config;
