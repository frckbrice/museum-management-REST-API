/**
 * 404 Not Found handler for API routes (Web API standard).
 * Sends a consistent JSON error when no route matches under the API base path.
 */
import type { Request, Response, NextFunction } from "express";
import { sendErrorResponse } from "./errors/error-response";

export function notFoundMiddleware(req: Request, res: Response, _next: NextFunction): void {
  sendErrorResponse(res, 404, "Resource not found", {
    path: req.originalUrl || req.path,
    requestId: req.requestId,
    code: "NOT_FOUND",
  });
}

export default notFoundMiddleware;
