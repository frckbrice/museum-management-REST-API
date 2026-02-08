import { Router } from "express";
import { galleryController } from "../controllers";
import { requireAuth } from "../../config/auth/auth-config";

const router = Router();

// Get all gallery items or filter by category (public)
router.get("/galleries", galleryController.getAllGalleryItems);

// More specific path before /galleries/:id (RESTful route order)
router.get("/galleries/categories/:category", galleryController.getGalleryItemsByCategory);

// Get gallery item by ID (public)
router.get("/galleries/:id", galleryController.getGalleryItemById);

// Create gallery item (authenticated per API spec)
router.post("/galleries", requireAuth, galleryController.createGalleryItem);

export default router;
