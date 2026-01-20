import { logEvents } from "../logger";

const errorHandler = (err: any, req: any, res: any, next: any) => {
    if (logEvents)
        logEvents(
            `${err.name}:${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');

    console.error("\n\n hit error handler  \n\n");
    const statusCode = res.statusCode ? res.statusCode : 500; // Server Error
    res.status(statusCode).send({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        method: req.method,
        origin: req.url,
        timestamp: new Date().toISOString(),
    });

    next(err);
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
