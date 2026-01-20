import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Extend Express Request type to include requestId
 */
declare global {
    namespace Express {
        interface Request {
            requestId?: string;
        }
    }
}

/**
 * Request ID middleware
 * Generates a unique request ID for each incoming request
 * and adds it to the request object and response headers
 */
export const requestIdMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Generate or use existing request ID (from X-Request-ID header if present)
    const requestId = req.headers['x-request-id'] as string || uuidv4();

    // Attach to request object
    req.requestId = requestId;

    // Add to response headers for client tracking
    res.setHeader('X-Request-ID', requestId);

    // Add to response locals for logging
    res.locals.requestId = requestId;

    next();
};

export default requestIdMiddleware;
