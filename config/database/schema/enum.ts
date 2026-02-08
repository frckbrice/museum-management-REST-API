// Updated schema with improvements

import { pgEnum } from "drizzle-orm/pg-core";

// Enums
export const userStatus = pgEnum("user_status", ["visitor", "attendant", "admin"]);
export const bookingStatus = pgEnum("booking_status", ["pending", "confirmed", "cancelled"]);

export default {
  userStatus,
  bookingStatus,
};
