import { defineConfig, Config } from "drizzle-kit";

if (!process.env.DATABASE_URL_PROD) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./config/database/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_PROD,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
