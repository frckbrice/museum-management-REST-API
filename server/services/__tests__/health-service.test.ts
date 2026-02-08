/**
 * Unit tests for server/services/health-service.ts.
 * Covers checkDb() with mocked pg pool (success and failure).
 */
import { checkDb } from "../health-service";

jest.mock("../../../config/database/db-connection", () => {
  const mockQuery = jest.fn();
  return {
    __esModule: true,
    default: {
      pool: {
        query: mockQuery,
      },
    },
  };
});

const dbConnection = require("../../../config/database/db-connection");
const pool = dbConnection.default.pool;

describe("HealthService / checkDb", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when pool.query resolves", async () => {
    pool.query.mockResolvedValue(undefined);
    await expect(checkDb()).resolves.toBe(true);
    expect(pool.query).toHaveBeenCalledWith("SELECT 1");
  });

  it("returns false when pool.query rejects", async () => {
    pool.query.mockRejectedValue(new Error("connection refused"));
    await expect(checkDb()).resolves.toBe(false);
  });
});
