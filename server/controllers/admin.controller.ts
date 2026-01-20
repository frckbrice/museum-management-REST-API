import { Request, Response } from 'express';
import { contactService } from '../services';


export class AdminController {
    async getAllContactMessages(req: Request, res: Response) {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const pageSize = req.query.offset ? parseInt(req.query.pageSize as string) : 20;
            const limit = pageSize || 20; // Default to 20 if not provided
            const offset = page ? (page - 1) * limit : 0; //
            const messages = await contactService.getAllContactMessages(limit, offset);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get contact messages' });
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

}

export const adminController = new AdminController();
