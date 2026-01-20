import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
// Importing the logEvents function from the logger module to log events
// This function is used to log messages to a file, typically for error logging or monitoring purposes

import { logEvents } from './logger';

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per windowMs
    message: {
        message: "Too many login attempts from this IP, please try again after 1 minutes",
    },
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
        logEvents(
            `${options.message.message}\t${req.method}\t${req.headers.origin}\t${req.url}`,
            "errLog.log"
        );
        res.status(429).json({
            message: "Too many login attempts from this IP, please try again after 1 minutes",
        });
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: true, // Skip failed requests
    skipSuccessfulRequests: false, // Do not skip successful requests
});
export default loginLimiter;
// This code is a middleware for an Express.js application that limits the number of login attempts from a single IP address.
// It uses the `express-rate-limit` package to set a limit of 5 login attempts per 1 minutes.
// If the limit is exceeded, it logs the event and sends a 429 status code with a message indicating that too many login attempts have been made.
// The `logEvents` function is used to log the details of the request, including the method, origin, and URL, to a log file named "errLog.log".
// This is useful for preventing brute-force attacks on the login endpoint by limiting the number of attempts from a single IP address.