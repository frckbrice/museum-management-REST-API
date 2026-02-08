/**
 * Health check controller — exposes a single GET /health endpoint.
 * Returns a standard REST envelope with status, version, and dependency checks (e.g. DB).
 * Used by load balancers and monitoring; supports CORS for dashboard UIs.
 */
import { Request, Response } from "express";
import { checkDb } from "../services/health-service";
import type { ApiSuccessResponse, HealthCheckData } from "../types/api-response";

const version = process.env.npm_package_version ?? "1.0.0";

export class HealthController {
  /**
   * GET /health — returns service health and dependency status (readiness).
   * 200 when healthy, 503 when unhealthy (e.g. DB down).
   */
  async healthCheck(_req: Request, res: Response): Promise<void> {
    const dbOk = await checkDb();
    const status: HealthCheckData["status"] = dbOk ? "healthy" : "unhealthy";
    const data: HealthCheckData = {
      status,
      timestamp: new Date().toISOString(),
      version,
      checks: { database: dbOk ? "up" : "down" },
    };
    const body: ApiSuccessResponse<HealthCheckData> = { success: true, data };
    res.status(dbOk ? 200 : 503).json(body);
  }

  /**
   * GET /live — liveness probe (no dependencies). Always 200 if process is running.
   * Use for Kubernetes liveness; do not use for readiness.
   */
  async live(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { status: "alive", timestamp: new Date().toISOString() },
    });
  }

  /**
   * GET /ready — readiness probe (same as /health). 200 when DB is up and ready for traffic.
   */
  async ready(req: Request, res: Response): Promise<void> {
    return this.healthCheck(req, res);
  }
}

export const healthController = new HealthController();
