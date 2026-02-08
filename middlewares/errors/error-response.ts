import type { Response } from "express";

/**
 * Standard JSON error shape for all API error responses.
 * Used by the global error handler and by sendErrorResponse() for one-off errors.
 */
export interface StandardErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
    stack?: string;
  };
  requestId?: string;
  timestamp: string;
  path: string;
}

export interface SendErrorOptions {
  requestId?: string;
  path?: string;
  code?: string;
  details?: unknown;
  includeStack?: boolean;
}

/**
 * Send a standardized error response. Use for one-off errors in middleware or routes
 * when not throwing an AppError. Prefer throwing AppError subclasses so the global
 * handler can format the response.
 */
export function sendErrorResponse(
  res: Response,
  statusCode: number,
  message: string,
  options: SendErrorOptions = {}
): void {
  const { requestId, path, code, details, includeStack } = options;
  const err = res.locals?.error as Error | undefined;
  const body: StandardErrorResponse = {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(details !== undefined && { details }),
      ...(includeStack && err?.stack && { stack: err.stack }),
    },
    ...(requestId && { requestId }),
    timestamp: new Date().toISOString(),
    path: path ?? res.req?.path ?? "/",
  };
  res.status(statusCode).json(body);
}
