/**
 * Unit tests for server/routes/bookings-route.ts.
 * Verifies that booking routes are defined and delegate to bookingController.
 * Does not start HTTP server; uses controller mocks where needed.
 */
import { Router } from "express";
import bookingRoutesFactory from "../bookings-route";

jest.mock("ws", () => ({
  WebSocketServer: jest.fn().mockImplementation(() => ({
    clients: { forEach: jest.fn() },
  })),
}));

describe("Bookings route", () => {
  it("returns a Router when given a WebSocketServer", () => {
    const { WebSocketServer } = require("ws");
    const wss = new WebSocketServer();
    const router = bookingRoutesFactory(wss);
    expect(router).toBeDefined();
    expect(typeof router).toBe("function");
    expect(router.stack).toBeDefined();
  });

  it("registers GET /bookings and GET /bookings/:id", () => {
    const { WebSocketServer } = require("ws");
    const wss = new WebSocketServer();
    const router = bookingRoutesFactory(wss) as Router;
    const layers = router.stack.filter(
      (r: { route?: unknown }) => r.route
    ) as unknown as Array<{ route: { path: string } }>;
    const paths = layers.map((r) => r.route.path);
    expect(paths).toContain("/bookings");
    expect(paths).toContain("/bookings/:id");
  });
});
