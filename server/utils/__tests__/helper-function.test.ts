/**
 * Unit tests for server/utils/helper-function.ts.
 * Covers getServerConfig() for development and production environments,
 * including URL parsing and required env vars. Uses mocked env-validation.
 */
jest.mock("../../../config/env/env-validation", () => ({
  env: {
    NODE_ENV: "development",
    PORT: 5001,
    API_PROD_URL: undefined as string | undefined,
  },
}));

import { getServerConfig } from "../helper-function";

describe("helper-function", () => {
  let env: { NODE_ENV: string; PORT: number; API_PROD_URL?: string };
  beforeEach(() => {
    env = require("../../../config/env/env-validation").env;
    env.NODE_ENV = "development";
    env.PORT = 5001;
    env.API_PROD_URL = undefined;
  });

  describe("getServerConfig", () => {
    it("returns development config when NODE_ENV is not production", () => {
      env.NODE_ENV = "development";
      env.PORT = 4000;
      env.NODE_ENV = "development";
      env.PORT = 4000;
      const config = getServerConfig();
      expect(config).toEqual({
        host: "localhost",
        port: 4000,
        url: "http://localhost:4000",
      });
    });

    it("returns development config when NODE_ENV is test", () => {
      env.NODE_ENV = "test";
      env.PORT = 5000;
      const config = getServerConfig();
      expect(config.host).toBe("localhost");
      expect(config.port).toBe(5000);
      expect(config.url).toContain("5000");
    });

    it("throws when NODE_ENV is production and API_PROD_URL is missing", () => {
      env.NODE_ENV = "production";
      env.API_PROD_URL = undefined;
      expect(() => getServerConfig()).toThrow("API_PROD_URL environment variable is required");
    });

    it("returns production config with parsed host and port from API_PROD_URL", () => {
      env.NODE_ENV = "production";
      env.API_PROD_URL = "https://api.example.com:443";
      const config = getServerConfig();
      expect(config.host).toBe("api.example.com");
      expect(config.port).toBe(443);
      expect(config.url).toBe("https://api.example.com:443");
    });

    it("uses port 80 for http when no port in URL", () => {
      env.NODE_ENV = "production";
      env.API_PROD_URL = "http://api.example.com";
      const config = getServerConfig();
      expect(config.port).toBe(80);
    });

    it("uses port 443 for https when no port in URL", () => {
      env.NODE_ENV = "production";
      env.API_PROD_URL = "https://api.example.com";
      const config = getServerConfig();
      expect(config.port).toBe(443);
    });
  });
});
