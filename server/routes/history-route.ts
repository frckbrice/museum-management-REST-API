import { Router } from "express";
import { historyController } from "../controllers";
import { requireAuth } from "../../config/auth/auth-config";

const router = Router();

// Get all history content (public)
router.get("/histories", historyController.getAllHistoryContent);

// Get history content by slug or by id (public; param disambiguation in controller if needed)
router.get("/histories/:slug", historyController.getHistoryContentBySlug);
router.get("/histories/:id", historyController.getHistoryContentById);

// Create a new history content (authenticated per API spec)
router.post("/histories", requireAuth, historyController.createHistoryContent);

// Update an existing history content (authenticated per API spec)
router.put("/histories/:id", requireAuth, historyController.updateHistoryContent);

// Delete an existing history content (authenticated per API spec)
router.delete("/histories/:id", requireAuth, historyController.deleteHistoryContent);

export default router;
