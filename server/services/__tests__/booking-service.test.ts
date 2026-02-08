/**
 * Unit tests for server/services/booking-service.ts.
 * Covers getBookingById, getBookingsByUserId, getAllBookings (validation and status),
 * updateBookingStatus with mocked db and validateId.
 */
import { BookingService } from "../booking-service";
import { NotFoundError, ValidationError } from "../../../middlewares/errors/error-handler";
import { eq } from "drizzle-orm";
import { bookings } from "../../../config/database/schema/tables";

jest.mock("../../utils/validations/uuid-validator");

const mockDb = {
  query: {
    bookings: { findFirst: jest.fn(), findMany: jest.fn() },
  },
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
};

describe("BookingService", () => {
  let bookingService: BookingService;
  const mockBaseService = {
    withErrorHandling: jest.fn(async (fn: () => Promise<unknown>) => fn()),
    db: mockDb,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.where.mockReturnValue({ returning: jest.fn() });
    bookingService = new BookingService();
    Object.assign(bookingService, mockBaseService);
  });

  describe("getBookingById", () => {
    it("returns booking when found", async () => {
      const validateId = require("../../utils/validations/uuid-validator").validateId;
      validateId.mockReturnValue("valid-id");
      const mockBooking = { id: "valid-id", email: "u@e.com" };
      mockDb.query.bookings.findFirst.mockResolvedValue(mockBooking);

      const result = await bookingService.getBookingById("valid-id");
      expect(result).toEqual(mockBooking);
    });

    it("returns null when not found", async () => {
      const validateId = require("../../utils/validations/uuid-validator").validateId;
      validateId.mockReturnValue("valid-id");
      mockDb.query.bookings.findFirst.mockResolvedValue(null);

      const result = await bookingService.getBookingById("valid-id");
      expect(result).toBeNull();
    });

    it("throws ValidationError for invalid id", async () => {
      const validateId = require("../../utils/validations/uuid-validator").validateId;
      validateId.mockImplementation(() => {
        throw new ValidationError("Invalid booking id");
      });
      await expect(bookingService.getBookingById("invalid")).rejects.toThrow(ValidationError);
    });
  });

  describe("getAllBookings", () => {
    it("throws ValidationError for invalid status", async () => {
      await expect(bookingService.getAllBookings("invalid-status")).rejects.toThrow(
        ValidationError
      );
    });

    it("returns data and total when status is valid", async () => {
      const mockData = [{ id: "b1" }];
      const mockTotal = [{ count: 1 }];
      mockDb.query.bookings.findMany.mockResolvedValue(mockData);
      mockDb.where.mockResolvedValue(mockTotal);

      const result = await bookingService.getAllBookings("pending", 10, 0);
      expect(result.data).toEqual(mockData);
      expect(result.total).toBe(1);
    });
  });

  describe("updateBookingStatus", () => {
    it("throws ValidationError for invalid status", async () => {
      const validateId = require("../../utils/validations/uuid-validator").validateId;
      validateId.mockReturnValue("valid-id");
      await expect(
        bookingService.updateBookingStatus("valid-id", "invalid")
      ).rejects.toThrow(ValidationError);
    });

    it("throws NotFoundError when no row updated", async () => {
      const validateId = require("../../utils/validations/uuid-validator").validateId;
      validateId.mockReturnValue("valid-id");
      const returningFn = jest.fn().mockResolvedValue([]);
      mockDb.where.mockReturnValue({ returning: returningFn });

      await expect(
        bookingService.updateBookingStatus("valid-id", "confirmed")
      ).rejects.toThrow(NotFoundError);
    });

    it("returns updated booking when found", async () => {
      const validateId = require("../../utils/validations/uuid-validator").validateId;
      validateId.mockReturnValue("valid-id");
      const updated = { id: "valid-id", status: "confirmed" };
      mockDb.where.mockReturnValue({ returning: jest.fn().mockResolvedValue([updated]) });

      const result = await bookingService.updateBookingStatus("valid-id", "confirmed");
      expect(result).toEqual(updated);
      expect(mockDb.where).toHaveBeenCalledWith(eq(bookings.id, "valid-id"));
    });
  });
});
