import { Request, Response } from "express";
import { galleryService } from "../services";
import { uploadSingleImage, getImageUrl } from "../../config/bucket-storage/uploadMiddleware";

export class GalleryController {
  async getGalleryItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await galleryService.getGalleryItemById(id);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery item" });
    }
  }

  async getAllGalleryItems(req: Request, res: Response) {
    try {
      const category = req.query.category as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
      const limit = pageSize || 20; // Default to 50 if not provided
      const offset = page ? (page - 1) * limit : 0; //

      const items = await galleryService.getAllGalleryItems(category, limit, offset);

      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery items" });
    }
  }

  async getGalleryItemsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined;
      const limit = pageSize || 20; // Default to 50 if not provided
      const offset = page ? (page - 1) * limit : 0; //

      const items = await galleryService.getGalleryItemsByCategory(category, limit, offset);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gallery items by category" });
    }
  }

  async createGalleryItem(req: Request, res: Response) {
    try {
      // Handle file upload first
      uploadSingleImage(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: "Image file is required" });
        }

        const data = {
          ...req.body,
          imageUrl: getImageUrl(req.file), // Get Cloudinary URL
        };

        const item = await galleryService.createGalleryItem(data);
        res.status(201).json(item);
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create gallery item" });
    }
  }
}

export const galleryController = new GalleryController();
