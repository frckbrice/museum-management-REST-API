/**
 * CORS integration tests — assert CORS behavior on the real Express app.
 * Uses supertest against createApp() with health route only; health service is mocked.
 * Ensures OPTIONS preflight and GET with Origin return correct CORS headers.
 */
/// <reference path="../../../types/supertest.d.ts" />
import request from "supertest";
import { createApp } from "../../../app";
import healthRoute from "../health-check-route";
import errorHandler from "../../../middlewares/errors/error-handler";

jest.mock("../../services/health-service", () => ({
  checkDb: jest.fn().mockResolvedValue(true),
}));

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
const basePath = "/api/v1";

function buildTestApp(): ReturnType<typeof createApp> {
  const app = createApp();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- test context Express typings may not expose .use()
  (app as any).use(basePath, healthRoute);
  (app as any).use(errorHandler);
  return app;
}

describe("CORS integration", () => {
  const app = buildTestApp();

  describe("OPTIONS preflight", () => {
    it("returns 204 for OPTIONS with allowed Origin and sets CORS headers", async () => {
      const res = await request(app)
        .options(`${basePath}/health`)
        .set("Origin", allowedOrigin)
        .set("Access-Control-Request-Method", "GET");

      expect(res.status).toBe(204);
      expect(res.headers["access-control-allow-origin"]).toBe(allowedOrigin);
      expect(res.headers["access-control-allow-credentials"]).toBe("true");
    });

    it("allows OPTIONS without Origin (e.g. same-origin)", async () => {
      const res = await request(app).options(`${basePath}/health`);
      expect(res.status).toBe(204);
    });
  });

  describe("GET with Origin", () => {
    it("returns 200 and CORS headers for allowed Origin", async () => {
      const res = await request(app).get(`${basePath}/health`).set("Origin", allowedOrigin);

      expect(res.status).toBe(200);
      expect(res.headers["access-control-allow-origin"]).toBe(allowedOrigin);
      expect(res.body).toMatchObject({ success: true, data: { status: "healthy" } });
    });

    it("does not set Access-Control-Allow-Origin for disallowed Origin", async () => {
      const res = await request(app)
        .get(`${basePath}/health`)
        .set("Origin", "https://evil.example.com");

      expect(res.status).toBe(500);
      expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    });
  });

  describe("exposed headers", () => {
    it("response includes X-Request-ID when present in request", async () => {
      const res = await request(app)
        .get(`${basePath}/health`)
        .set("Origin", allowedOrigin)
        .set("X-Request-ID", "test-id-123");

      expect(res.status).toBe(200);
      expect(res.headers["access-control-expose-headers"]).toMatch(/x-request-id/i);
    });
  });
});
