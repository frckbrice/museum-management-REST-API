import { Router } from "express";
import { contactService } from "../services";
import { ContactMessage, insertContactMessageSchema } from "../../config/database/schema/schema-types";
import { z } from "zod";
import { contactController } from '../controllers';


const router = Router();

// Submit contact form
router.post("/contact_messages", contactController.createContactMessage);

// Get all contact messages
router.get("/contact_messages", contactController.getAllContactMessages);

// Mark a contact message as read
router.patch("/contact_messages/:id/read", contactController.markContactMessageAsRead);

// Get unread contact messages count
router.get("/contact_messages/unread_count", contactController.getUnreadContactMessagesCount);


export default router;
