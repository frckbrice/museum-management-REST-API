import { Router } from "express";
import { contactController } from "../controllers";
import { requireAuth } from "../../config/auth/auth-config";

const router = Router();

// Submit contact form (public per API spec)
router.post("/contact_messages", contactController.createContactMessage);

// Authenticated contact message operations (list, unread count, mark read)
router.get("/contact_messages", requireAuth, contactController.getAllContactMessages);
router.get(
  "/contact_messages/unread_count",
  requireAuth,
  contactController.getUnreadContactMessagesCount
);
router.patch(
  "/contact_messages/:id/read",
  requireAuth,
  contactController.markContactMessageAsRead
);

export default router;
