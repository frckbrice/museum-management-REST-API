import { Router } from "express";
import { adminController } from "../controllers";
import { requireAdmin } from "../../config/auth/auth-config";

const router = Router();

// router.use(requireAdmin);

// Get all contact messages (admin only)
router.get("/admin/contact-messages", adminController.getAllContactMessages);

// Get contact message by ID (admin only)
router.get("/admin/contact-messages/:id", adminController.getContactMessageById);

// Mark contact message as read (admin only)
router.patch("/admin/contact-messages/:id/read", adminController.markContactMessageAsRead);

// Delete contact message (admin only)
router.delete("/admin/contact-messages/:id", adminController.deleteContactMessage);

export default router;
