import { Request, Response } from "express";
import { contactService } from "../services";
import { NotFoundError } from "../../middlewares/errors/error-handler";

export class AdminController {
  async getAllContactMessages(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
      const limit = pageSize || 20;
      const offset = page ? (page - 1) * limit : 0;
      const messages = await contactService.getAllContactMessages(limit, offset);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get contact messages" });
    }
  }

  async getContactMessageById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await contactService.getContactMessageById(id);
      res.json(message);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: { message: error.message } });
      }
      res.status(500).json({ error: "Failed to get contact message" });
    }
  }

  async markContactMessageAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await contactService.markContactMessageAsRead(id);
      res.json({ success: true });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: { message: error.message } });
      }
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  }

  async deleteContactMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await contactService.deleteContactMessage(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, error: { message: error.message } });
      }
      res.status(500).json({ error: "Failed to delete contact message" });
    }
  }
}

export const adminController = new AdminController();
