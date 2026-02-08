/**
 * CORS config tests — ensure allowed origins and options are correct.
 * Run with: pnpm test -- cors
 */
import { getCorsOptions } from "../../../config/cors/cors-options";
import { getAllowedOrigins } from "../../../config/cors/allowed-origins";

describe("CORS", () => {
  const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

  describe("getAllowedOrigins", () => {
    it("includes FRONTEND_URL", () => {
      const origins = getAllowedOrigins();
      expect(origins).toContain(allowedOrigin);
    });

    it("never includes wildcard (unsafe with credentials)", () => {
      const origins = getAllowedOrigins();
      expect(origins).not.toContain("*");
    });
  });

  describe("getCorsOptions", () => {
    it("returns credentials true and optionsSuccessStatus 204", () => {
      const opts = getCorsOptions();
      expect(opts.credentials).toBe(true);
      expect(opts.optionsSuccessStatus).toBe(204);
    });

    it("allows allowed origin via origin callback", (done) => {
      const opts = getCorsOptions();
      const callback = opts.origin as (
        origin: string,
        cb: (err: Error | null, allow?: boolean) => void
      ) => void;
      callback(allowedOrigin, (err, allow) => {
        expect(err).toBeNull();
        expect(allow).toBe(true);
        done();
      });
    });

    it("rejects disallowed origin via origin callback", (done) => {
      const opts = getCorsOptions();
      const callback = opts.origin as (
        origin: string,
        cb: (err: Error | null, allow?: boolean) => void
      ) => void;
      callback("https://evil.example.com", (err) => {
        expect(err).toBeInstanceOf(Error);
        expect((err as Error).message).toMatch(/Origin not allowed|CORS/i);
        done();
      });
    });

    it("allows no origin (e.g. same-origin or server-to-server)", (done) => {
      const opts = getCorsOptions();
      const callback = opts.origin as (
        origin: string | undefined,
        cb: (err: Error | null, allow?: boolean) => void
      ) => void;
      callback(undefined, (err, allow) => {
        expect(err).toBeNull();
        expect(allow).toBe(true);
        done();
      });
    });

    it("exposes X-Request-ID in exposedHeaders", () => {
      const opts = getCorsOptions();
      expect(opts.exposedHeaders).toBeDefined();
      const exposed = (opts.exposedHeaders as string[]).map((h) => h.toLowerCase());
      expect(exposed).toContain("x-request-id");
    });
  });
});
