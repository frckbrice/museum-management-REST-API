import * as schema from "./schema/tables";
import * as relations from "./schema/relations";
import ws from "ws";
import { Pool as PgPool } from "pg"; // Local PostgreSQL
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless"; // Neon
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import { env } from "../env/env-validation";

if (!env.DATABASE_URL_PROD && !env.DATABASE_URL) {
  throw new Error(
    "Either DATABASE_URL or DATABASE_URL_PROD must be set. Did you forget to provision a database?"
  );
}

const isLocal =
  (env.DATABASE_URL && env.DATABASE_URL.includes("localhost")) || env.NODE_ENV === "development";

let pool, db;

if (env.DATABASE_URL_PROD) {
  // Use production DB (Neon serverless)
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: env.DATABASE_URL_PROD });
  db = neonDrizzle(pool, { schema: { ...schema, ...relations } });
} else if (isLocal && env.DATABASE_URL) {
  // Local PostgreSQL setup
  pool = new PgPool({
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  db = pgDrizzle(pool, { schema: { ...schema, ...relations } });
} else {
  throw new Error("No valid database URL provided");
}

export default { pool, db };
