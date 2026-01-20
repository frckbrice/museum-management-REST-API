import { Request, Response } from 'express';
import { bookingService } from '../services';
import { z } from 'zod';
import { WebSocketServer } from 'ws';
import { insertBookingSchema } from '../../config/database/schema/schema-types';
import { bookingStatus } from '../../config/database/schema/enum';

export class BookingController {
    async getBookingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const booking = await bookingService.getBookingById(id);
            res.json(booking);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get booking' });
        }
    }

    async getBookingsByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
            const limit = pageSize || 20; // Default to 50 if not provided
            const offset = page ? (page - 1) * limit : 0; //
            const bookings = await bookingService.getBookingsByUserId(userId, limit, offset);
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user bookings' });
        }
    }

    async getAllBookings(req: Request, res: Response) {
        try {
            const status = req.query.status as string;
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
            const limit = pageSize || 20; // Default to 50 if not provided
            const offset = page ? (page - 1) * limit : 0; //

            if (!req.isAuthenticated()) {
                return res.status(401).json({ message: "Authentication required" });
            }

            if (req.user.userType === 'visitor') {
                // Visitors can only see their own bookings
                const bookings = await bookingService.getBookingsByUserId(req.user.id, limit, offset);
                return res.json(bookings);
            } else {
                // Attendants and admins can see all bookings
                const bookings = await bookingService.getAllBookings(status as string, limit, offset);
                return res.json(bookings);
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get all bookings' });
        }
    }

    async createBooking(req: Request, res: Response) {
        return async (wss: WebSocketServer) => {
            try {
                const validatedData = insertBookingSchema.parse(req.body);

                // Add userId if available (user is logged in)
                if (req.isAuthenticated()) {
                    validatedData.userId = req.user.id;
                }

                const booking = await bookingService.createBooking(validatedData);

                // Send booking confirmation via WebSocket
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'booking_confirmation',
                            data: booking
                        }));
                    }
                });

                res.status(201).json(booking);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return res.status(400).json({ errors: error.errors });
                }
                console.error("Error creating booking:", error);
                res.status(500).json({ message: "Failed to create booking" });
            }
        }
    }

    async updateBookingStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const bookingsStatus = bookingStatus.enumValues;

            if (!status || !bookingsStatus.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const booking = await bookingService.updateBookingStatus(id, status);

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            res.json(booking);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update booking status' });
        }
    }
}

export const bookingController = new BookingController();
