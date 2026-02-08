/**
 * Unit tests for server/controllers/booking.controller.ts.
 * Covers getBookingById, getBookingsByUserId, updateBookingStatus with mocked bookingService.
 */
import { Request, Response } from "express";
import { bookingController } from "../booking.controller";

jest.mock("../../services", () => ({
  bookingService: {
    getBookingById: jest.fn(),
    getBookingsByUserId: jest.fn(),
    getAllBookings: jest.fn(),
    updateBookingStatus: jest.fn(),
  },
}));

const bookingService = require("../../services").bookingService;

describe("BookingController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = { params: {}, query: {}, body: {} };
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  describe("getBookingById", () => {
    it("returns booking when found", async () => {
      const mockBooking = { id: "bid-1", email: "u@e.com" };
      req.params = { id: "bid-1" };
      bookingService.getBookingById.mockResolvedValue(mockBooking);

      await bookingController.getBookingById(req as Request, res as Response);

      expect(bookingService.getBookingById).toHaveBeenCalledWith("bid-1");
      expect(jsonMock).toHaveBeenCalledWith(mockBooking);
    });
  });

  describe("getBookingsByUserId", () => {
    it("returns paginated bookings for user", async () => {
      const mockResult = { data: [{ id: "b1" }], total: 1, hasMore: false };
      req.params = { userId: "user-1" };
      req.query = { page: "1", pageSize: "20" };
      bookingService.getBookingsByUserId.mockResolvedValue(mockResult);

      await bookingController.getBookingsByUserId(req as Request, res as Response);

      expect(bookingService.getBookingsByUserId).toHaveBeenCalledWith("user-1", 20, 0);
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });
  });

  describe("updateBookingStatus", () => {
    it("returns 400 when status is invalid", async () => {
      req.params = { id: "bid-1" };
      req.body = { status: "invalid" };

      await bookingController.updateBookingStatus(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: "Invalid status" }));
    });

    it("returns 404 when booking not found", async () => {
      req.params = { id: "bid-1" };
      req.body = { status: "confirmed" };
      bookingService.updateBookingStatus.mockResolvedValue(null);

      await bookingController.updateBookingStatus(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: "Booking not found" }));
    });

    it("returns booking when update succeeds", async () => {
      const updated = { id: "bid-1", status: "confirmed" };
      req.params = { id: "bid-1" };
      req.body = { status: "confirmed" };
      bookingService.updateBookingStatus.mockResolvedValue(updated);

      await bookingController.updateBookingStatus(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(updated);
    });
  });
});
