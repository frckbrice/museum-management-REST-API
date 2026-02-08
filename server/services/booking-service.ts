// services/booking/booking-service.ts
import { eq, desc, count, sql } from "drizzle-orm";
import { type Booking } from "../../config/database/schema/schema-types";
import { NotFoundError, ValidationError } from "../../middlewares/errors/error-handler";
import { BaseService } from "./base-service";
import { validateId } from "../../server/utils/validations/uuid-validator";
import { bookings } from "../../config/database/schema/tables";
import { bookingStatus } from "../../config/database/schema/enum";

export class BookingService extends BaseService {
  async getBookingById(id: string): Promise<Booking | null> {
    validateId(id, "booking id");

    return this.withErrorHandling(async () => {
      const result = await this.db.query.bookings.findFirst({
        where: eq(bookings.id, id),
      });
      return result || null;
    }, "getBookingById");
  }

  async getBookingsByUserId(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{
    data: Booking[];
    total: number;
    hasMore: boolean;
  }> {
    validateId(userId, "user id");

    return this.withErrorHandling(async () => {
      const [data, totalResult] = await Promise.all([
        this.db.query.bookings.findMany({
          where: eq(bookings.userId, userId),
          limit,
          offset,
          orderBy: desc(bookings.visitDate),
        }),
        this.db.select({ count: count() }).from(bookings).where(eq(bookings.userId, userId)),
      ]);

      const total = totalResult[0]?.count || 0;
      const hasMore = offset + limit < total;

      return { data, total, hasMore };
    }, "getBookingsByUserId");
  }

  async getAllBookings(
    status?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    data: Booking[];
    total: number;
    hasMore: boolean;
  }> {
    // Get valid enum values from the schema definition
    const validStatuses = bookingStatus.enumValues;

    if (status && !validStatuses.includes(status as (typeof validStatuses)[number])) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    return this.withErrorHandling(async () => {
      const whereCondition = status
        ? eq(bookings.status, status as (typeof bookingStatus.enumValues)[number])
        : undefined;

      const [data, totalResult] = await Promise.all([
        this.db.query.bookings.findMany({
          where: whereCondition,
          limit,
          offset,
          orderBy: desc(bookings.visitDate),
          with: {
            user: true, // Include related author data
          },
        }),
        this.db
          .select({ count: count() })
          .from(bookings)
          .where(whereCondition || sql`true`),
      ]);

      const total = totalResult[0]?.count || 0;
      const hasMore = offset + limit < total;

      return { data, total, hasMore };
    }, "getAllBookings");
  }

  async createBooking(data: Partial<Booking>): Promise<Booking> {
    if (!data.email || !data.visitDate) {
      throw new ValidationError("UserId and visitDate are required");
    }

    // Validate visit date is in the future
    const visitDate = new Date(data.visitDate);
    if (new Date(visitDate).getTime() <= new Date().getTime()) {
      throw new ValidationError("Visit date must be in the future");
    }

    const sanitizedData: Partial<Booking> = {
      ...data,
      visitDate: new Date(data.visitDate).toISOString(),
      status: data.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.withErrorHandling(async () => {
      const [booking] = await this.db
        .insert(bookings)
        .values(sanitizedData as Booking)
        .returning();
      return booking;
    }, "createBooking");
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    validateId(id, "booking id");

    const validStatuses = bookingStatus.enumValues;
    if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    return this.withErrorHandling(async () => {
      const [updatedBooking] = await this.db
        .update(bookings)
        .set({
          status: status as (typeof bookingStatus.enumValues)[number],
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id))
        .returning();

      if (!updatedBooking) {
        throw new NotFoundError("Booking", id);
      }

      return updatedBooking;
    }, "updateBookingStatus");
  }
}
