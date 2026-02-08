/**
 * Unit tests for server/controllers/health.controller.ts.
 * Covers healthCheck, live, and ready handlers with mocked health-service.
 */
import { Request, Response } from "express";
import { HealthController } from "../health.controller";

jest.mock("../../services/health-service", () => ({
  checkDb: jest.fn(),
}));

const checkDb = require("../../services/health-service").checkDb;

describe("HealthController", () => {
  let controller: HealthController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    controller = new HealthController();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {};
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  describe("healthCheck", () => {
    it("returns 200 and healthy status when checkDb is true", async () => {
      checkDb.mockResolvedValue(true);
      await controller.healthCheck(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: "healthy",
            checks: { database: "up" },
          }),
        })
      );
    });

    it("returns 503 and unhealthy status when checkDb is false", async () => {
      checkDb.mockResolvedValue(false);
      await controller.healthCheck(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(503);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: "unhealthy",
            checks: { database: "down" },
          }),
        })
      );
    });
  });

  describe("live", () => {
    it("returns 200 and alive status", async () => {
      await controller.live(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ status: "alive" }),
        })
      );
    });
  });

  describe("ready", () => {
    it("delegates to healthCheck", async () => {
      checkDb.mockResolvedValue(true);
      await controller.ready(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ status: "healthy" }),
        })
      );
    });
  });
});
