/**
 * Global API rate limiting — applies to all routes except health and API docs.
 * Uses express-rate-limit; trust proxy in production for correct client IP.
 */
import rateLimit from "express-rate-limit";
import { env } from "../config/env/env-validation";

const windowMs = 15 * 60 * 1000; // 15 minutes
const max = 200; // requests per IP per window

export const globalRateLimiter = rateLimit({
  windowMs,
  max,
  message: {
    success: false,
    error: { message: "Too many requests from this IP, please try again later." },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const path = req.path;
    // Skip health and docs so load balancers and monitoring are not limited
    if (path === "/api/v1/health" || path === "/api/v1/live" || path === "/api/v1/ready") return true;
    if (path === "/api-docs" || path === "/api-docs.json" || path.startsWith("/api-docs/")) return true;
    return false;
  },
  ...(env.NODE_ENV === "test" && { max: 10000 }),
});
