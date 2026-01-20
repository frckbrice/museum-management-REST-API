import { Request, Response } from 'express';
import { ContactMessage, contactService } from '../services';
import { insertContactMessageSchema } from '../../config/database/schema/schema-types';
import { z } from 'zod';
import { forumController } from '../controllers';

export class ContactController {
    async getAllContactMessages(req: Request, res: Response) {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
            const limit = pageSize || 20; // Default to 50 if not provided
            const offset = page ? (page - 1) * limit : 0; //

            const messages = await contactService.getAllContactMessages(limit, offset);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get contact messages' });
        }
    }

    async createContactMessage(req: Request, res: Response) {
        try {
            const validatedData: Partial<ContactMessage> = insertContactMessageSchema.parse(req.body);
            const message = await contactService.createContactMessage(validatedData);
            res.status(201).json({ success: true, id: message.id });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error("Error submitting contact form:", error);
            res.status(500).json({ message: "Failed to submit contact form" });
        }
    }

    async markContactMessageAsRead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await contactService.markContactMessageAsRead(id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to mark message as read' });
        }
    }

    async getUnreadContactMessagesCount(req: Request, res: Response) {
        try {
            const count = await contactService.getUnreadContactMessagesCount();
            res.json({ count });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get unread messages count' });
        }
    }
}

export const contactController = new ContactController();
