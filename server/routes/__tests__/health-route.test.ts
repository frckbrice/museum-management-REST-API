/**
 * Integration-style tests for server/routes/health-check-route.ts.
 * Asserts GET /health, /live, /ready handlers are wired and return correct status/body.
 * Uses direct controller calls with mocked health-service (no supertest).
 */
import { createApp } from "../../../app";
import healthRoute from "../health-check-route";
import errorHandler from "../../../middlewares/errors/error-handler";
import { healthController } from "../../controllers";
import { Request, Response } from "express";

jest.mock("../../services/health-service", () => ({
  checkDb: jest.fn().mockResolvedValue(true),
}));

function buildApp() {
  const app = createApp();
  app.use("/api/v1", healthRoute);
  app.use(errorHandler);
  return app;
}

describe("Health routes", () => {
  it("app mounts health routes without throwing", () => {
    expect(() => buildApp()).not.toThrow();
  });

  describe("health controller behavior (route logic)", () => {
    it("healthCheck returns 200 and healthy when checkDb is true", async () => {
      const req = {} as Request;
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });
      const res = { status, json } as unknown as Response;
      await healthController.healthCheck(req, res);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ status: "healthy", checks: { database: "up" } }),
        })
      );
    });

    it("live returns 200 and alive", async () => {
      const req = {} as Request;
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });
      const res = { status, json } as unknown as Response;
      await healthController.live(req, res);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: expect.objectContaining({ status: "alive" }) })
      );
    });

    it("ready delegates to healthCheck and returns 200 when DB up", async () => {
      const req = {} as Request;
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });
      const res = { status, json } as unknown as Response;
      await healthController.ready(req, res);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: expect.objectContaining({ status: "healthy" }) })
      );
    });
  });
});
