import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger/logger-config';

/**
 * Request logging middleware
 * Logs all incoming HTTP requests with structured data
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Capture response data
  let responseBody: any;
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    responseBody = body;
    return originalJson(body);
  };

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      origin: req.get('origin'),
      contentLength: res.get('content-length'),
    };

    // Log level based on status code
    if (res.statusCode >= 500) {
      logger.error('HTTP Request', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });

  next();
};

/**
 * Legacy logEvents function for backward compatibility
 * @deprecated Use logger from config/logger/logger-config instead
 */
export const logEvents = async (message: string, logFileName: string) => {
  logger.info(message, { logFile: logFileName });
};

export default requestLogger;
