import { Router } from "express";
import { galleryController } from '../controllers';


const router = Router();

// Get all gallery items or filter by category
router.get("/galleries", galleryController.getAllGalleryItems);

// Get gallery item by ID
router.get("/galleries/:id", galleryController.getGalleryItemById);

// create gallery item
router.post("/galleries", galleryController.createGalleryItem);

// get gallery item by category
router.get("/galleries/categories/:category", galleryController.getGalleryItemsByCategory);


export default router;
