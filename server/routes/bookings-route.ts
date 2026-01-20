import { Router } from "express";
import { WebSocketServer } from "ws";

import { bookingController } from '../controllers';


export default function bookingRoutes(wss: WebSocketServer) {
    const router = Router();

    // Create a booking
    router.post("/bookings", async (req, res) => (await bookingController.createBooking(req, res))(wss));

    // Get bookings (user-specific or all based on user type)
    router.get("/bookings", bookingController.getAllBookings);

    // Get booking by ID
    router.get("/bookings/:id", bookingController.getBookingById);

    // Update booking status (attendant-specific)
    router.patch("/bookings/attendant/:id/status", bookingController.updateBookingStatus);


    // get specific booking for a user by id
    router.get("/bookings/users/:userId", bookingController.getBookingsByUserId);

    // get booking by id
    router.get("/bookings/:id", bookingController.getBookingById);

    // delete booking
    // router.delete("/bookings/:id", bookingController.deleteBooking);


    return router;
}
