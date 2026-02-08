// services/base/base-service.ts
import dbPool from "../../config/database/db-connection";
import { Pool } from "pg";
import { withErrorHandling } from "../../middlewares/errors/error-handler";

const { db, pool } = dbPool;

export abstract class BaseService {
  protected db = db;
  protected connectionPool: Pool;

  constructor() {
    this.connectionPool = pool as Pool;
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.connectionPool.query("SELECT 1");
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }

  // Cleanup method for graceful shutdown
  async cleanup(): Promise<void> {
    try {
      await this.connectionPool.end();
      console.log("Database connection pool closed");
    } catch (error) {
      console.error("Error closing database connection pool:", error);
    }
  }

  protected withErrorHandling = withErrorHandling;
}
