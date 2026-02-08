/**
 * Project-wide Express application type.
 * Use this instead of Express/Application so all files see the same type;
 * in this project the types from "express" can resolve without .use/.set/.get in some modules.
 */
export interface ExpressApp {
  use(...args: unknown[]): ExpressApp;
  set(setting: string, val: unknown): ExpressApp;
  get(...args: unknown[]): unknown;
  [key: string]: unknown;
}

/** Next callback for middleware (use when Express NextFunction has no call signatures). */
export type ExpressNext = (err?: unknown) => void;

/** Minimal request shape for logging (use when Express Request does not expose path/method/requestId). */
export interface ExpressRequestLike {
  path: string;
  method: string;
  requestId?: string;
}

/** Minimal response shape (use when Express Response does not expose .json/.on/statusCode). */
export interface ExpressResponse {
  statusCode: number;
  json(body?: unknown): ExpressResponse | void;
  on(event: string, fn: () => void): void;
}
