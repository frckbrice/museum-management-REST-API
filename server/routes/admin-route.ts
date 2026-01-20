import { Router } from "express";
import { adminController } from '../controllers';
import { requireAdmin } from "../../config/auth/auth-config";


const router = Router();

// router.use(requireAdmin);

// Get all contact messages (admin only)
router.get("/admin/contact-messages", adminController.getAllContactMessages);

// Mark contact message as read (admin only)
router.patch("/admin/contact-messages/:id/read", adminController.markContactMessageAsRead);

export default router;
