/**
 * Global error handler and AppError hierarchy.
 * All API errors should use StandardErrorResponse; stack traces only in non-production.
 */
import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/logger/logger-config";
import type { StandardErrorResponse } from "./error-response";

/** Request-like shape for logging (method, path, requestId from middleware). */
interface RequestLike {
  method?: string;
  path?: string;
  requestId?: string;
}

/** Response-like with status + json for sending error body. */
interface ResponseLike {
  status(code: number): { json(body: unknown): void };
}

/** Base app error with HTTP status; subclasses define statusCode. */
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Express error middleware: logs and sends StandardErrorResponse; never leaks stack in production. */
const errorHandler = (
  err: unknown,
  req: RequestLike,
  res: Response & ResponseLike,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal server error";
  const path = typeof req.path === "string" ? req.path : "/";

  logger.error("Request error", {
    error: { name: err instanceof Error ? err.name : "Error", message },
    request: { method: req.method, path, requestId: req.requestId },
    statusCode,
  });

  const body: StandardErrorResponse = {
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== "production" &&
        err instanceof Error &&
        err.stack && { stack: err.stack }),
    },
    ...(req.requestId && { requestId: req.requestId }),
    timestamp: new Date().toISOString(),
    path,
  };
  res.status(statusCode).json(body);
};

export class DatabaseError extends AppError {
  readonly statusCode = 500;
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  constructor(message: string = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Wraps an async operation and maps known DB errors to AppError subclasses.
 * Use preserveErrors to re-throw specific error types unchanged.
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string,
  options: {
    preserveErrors?: boolean | Array<new (...args: any[]) => Error>;
  } = {}
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error(`Error in ${context}:`, error);
    }
    const shouldPreserve =
      options.preserveErrors === true ||
      (Array.isArray(options.preserveErrors) &&
        options.preserveErrors.some((ErrorType) => error instanceof ErrorType));
    if (shouldPreserve) {
      throw error;
    }
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        throw new DatabaseError(`Duplicate entry in ${context}`, error);
      }
      if (error.message.includes("foreign key")) {
        throw new DatabaseError(`Foreign key constraint violation in ${context}`, error);
      }
      if (error.message.includes("connection")) {
        throw new DatabaseError(`Database connection error in ${context}`, error);
      }
    }
    throw new DatabaseError(`Operation failed in ${context}`, error);
  }
};

export { sendErrorResponse } from "./error-response";
export type { StandardErrorResponse } from "./error-response";
export default errorHandler;
