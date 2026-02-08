import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";

/** Minimal logger interface used across the app */
export interface AppLogger {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
}

function createConsoleLogger(): AppLogger {
  const levelOrder = { debug: 0, info: 1, warn: 2, error: 3 };
  const minLevel = NODE_ENV === "production" ? "info" : "debug";
  const min = levelOrder[minLevel as keyof typeof levelOrder] ?? 0;
  const ts = () => new Date().toISOString();
  return {
    debug: (msg, meta) => {
      if (min <= 0) console.debug(ts(), "DEBUG", msg, meta ?? "");
    },
    info: (msg, meta) => {
      if (min <= 1) console.info(ts(), "INFO", msg, meta ?? "");
    },
    warn: (msg, meta) => {
      if (min <= 2) console.warn(ts(), "WARN", msg, meta ?? "");
    },
    error: (msg, meta) => {
      if (min <= 3) console.error(ts(), "ERROR", msg, meta ?? "");
    },
  };
}

function createWinstonLogger(): AppLogger {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const winston = require("winston");
  const logsDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  );

  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info: { timestamp?: string; level?: string; message?: string; [k: string]: unknown }) => {
        const { timestamp, level, message, ...rest } = info;
        let msg = `${timestamp ?? ""} [${level ?? ""}]: ${message ?? ""}`;
        if (Object.keys(rest).length > 0) msg += ` ${JSON.stringify(rest)}`;
        return msg;
      }
    )
  );

  const w = winston.createLogger({
    level: NODE_ENV === "production" ? "info" : "debug",
    format: logFormat,
    defaultMeta: { service: "museum-api" },
    transports: [
      new winston.transports.File({
        filename: path.join(logsDir, "combined.log"),
        maxsize: 5242880,
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: path.join(logsDir, "error.log"),
        level: "error",
        maxsize: 5242880,
        maxFiles: 5,
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: path.join(logsDir, "exceptions.log") }),
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: path.join(logsDir, "rejections.log") }),
    ],
  });

  w.add(
    new winston.transports.Console({
      format: NODE_ENV === "production" ? logFormat : consoleFormat,
    })
  );

  return {
    debug: (msg, meta) => w.debug(msg, meta),
    info: (msg, meta) => w.info(msg, meta),
    warn: (msg, meta) => w.warn(msg, meta),
    error: (msg, meta) => w.error(msg, meta),
  };
}

let logger: AppLogger;
try {
  require.resolve("winston");
  logger = createWinstonLogger();
} catch {
  logger = createConsoleLogger();
}

export { logger };
export default logger;
