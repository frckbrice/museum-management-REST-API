import { Router } from "express";
import { historyController } from "../controllers";

const router = Router();

// Get all history content
router.get("/histories", historyController.getAllHistoryContent);

// Get history content by slug
router.get("/histories/:slug", historyController.getHistoryContentBySlug);

// Create a new history content
router.post("/histories", historyController.createHistoryContent);

// Update an existing history content
router.put("/histories/:id", historyController.updateHistoryContent);

// Delete an existing history content
router.delete("/histories/:id", historyController.deleteHistoryContent);

// get content by id
// Get history content by slug
router.get("/histories/:id", historyController.getHistoryContentById);

export default router;
