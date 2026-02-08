/**
 * Health check service — DB-only. No dependency on other domains.
 * Keeps the health module microservice-ready.
 */
import dbPool from "../../config/database/db-connection";
import { logger } from "../../config/logger/logger-config";

const { pool } = dbPool;

/** Minimal type for DB health check; works with both pg.Pool and Neon Pool */
type PoolLike = { query: (sql: string) => Promise<unknown> };

export async function checkDb(): Promise<boolean> {
  try {
    await (pool as PoolLike).query("SELECT 1");
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const code = err instanceof Error && "code" in err ? (err as NodeJS.ErrnoException).code : undefined;
    logger.error("Health check: database unreachable", { message, code });
    return false;
  }
}
