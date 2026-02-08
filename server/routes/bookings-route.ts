import { Router } from "express";
import { WebSocketServer } from "ws";

import { bookingController } from "../controllers";
import { requireAuth, requireAttendant } from "../../config/auth/auth-config";

export default function bookingRoutes(wss: WebSocketServer) {
  const router = Router();

  // Create a booking (optional auth: session sets userId if present)
  router.post("/bookings", async (req, res) =>
    (await bookingController.createBooking(req, res))(wss)
  );

  // Get bookings (authenticated; visitors see own, attendants/admins see all)
  router.get("/bookings", requireAuth, bookingController.getAllBookings);

  // More specific paths before /bookings/:id (RESTful route order)
  router.get("/bookings/users/:userId", requireAuth, bookingController.getBookingsByUserId);
  router.patch(
    "/bookings/attendant/:id/status",
    requireAttendant,
    bookingController.updateBookingStatus
  );

  // Get booking by ID (authenticated)
  router.get("/bookings/:id", requireAuth, bookingController.getBookingById);

  return router;
}
