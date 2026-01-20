import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger/logger-config';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    // Log error with structured data
    logger.error('Error occurred', {
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack,
        },
        request: {
            method: req.method,
            url: req.url,
            path: req.path,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            origin: req.get('origin'),
        },
        statusCode,
    });

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message,
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
        },
        timestamp: new Date().toISOString(),
        path: req.path,
    });
};

// Custom error classes for better error handling
export class DatabaseError extends Error {
    constructor(message: string, public originalError?: unknown) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class NotFoundError extends Error {
    constructor(resource: string, id: string) {
        super(`${resource} with id ${id} not found`);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Enhanced error handling wrapper
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
        console.error(`\n\n💥 Error in ${context}:`, error);

        // Determine if we should preserve this error
        const shouldPreserve =
            options.preserveErrors === true ||
            (Array.isArray(options.preserveErrors) &&
                options.preserveErrors.some(ErrorType => error instanceof ErrorType));

        if (shouldPreserve) {
            throw error; // Re-throw original error
        }

        // Handle specific database errors
        if (error instanceof Error) {
            if (error.message.includes('duplicate key')) {
                throw new DatabaseError(`Duplicate entry in ${context}`, error);
            }
            if (error.message.includes('foreign key')) {
                throw new DatabaseError(`Foreign key constraint violation in ${context}`, error);
            }
            if (error.message.includes('connection')) {
                throw new DatabaseError(`Database connection error in ${context}`, error);
            }
        }

        throw new DatabaseError(`Operation failed in ${context}`, error);
    }
};

export default errorHandler;
