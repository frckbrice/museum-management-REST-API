// services/gallery/gallery-service.ts
import { eq, asc, count, sql } from "drizzle-orm";
import { type GalleryItem } from "../../config/database/schema/schema-types";
import { ValidationError } from "../../middlewares/errors/error-handler";
import { validateId } from "../../server/utils/validations/uuid-validator";
import { sanitizeString, slugify } from "../../server/utils/validations/email-validation";
import { BaseService } from "./base-service";
import { galleryItems } from "../../config/database/schema/tables";

export class GalleryService extends BaseService {
  async getGalleryItemById(id: string): Promise<GalleryItem | null> {
    validateId(id, "gallery item id");

    return this.withErrorHandling(async () => {
      const result = await this.db.query.galleryItems.findFirst({
        where: eq(galleryItems.id, id),
      });
      return result || null;
    }, "getGalleryItemById");
  }

  async getAllGalleryItems(
    category?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{
    data: GalleryItem[];
    total: number;
    hasMore: boolean;
  }> {
    if (limit < 1 || limit > 100) {
      throw new ValidationError("Limit must be between 1 and 100");
    }

    return this.withErrorHandling(async () => {
      const whereCondition = category ? eq(galleryItems.category, category) : undefined;

      const [data, totalResult] = await Promise.all([
        this.db.query.galleryItems.findMany({
          where: whereCondition,
          limit,
          offset,
          orderBy: asc(galleryItems.title),
        }),
        this.db
          .select({ count: count() })
          .from(galleryItems)
          .where(whereCondition || sql`true`),
      ]);

      const total = totalResult[0]?.count || 0;
      const hasMore = offset + limit < total;

      return { data, total, hasMore };
    }, "getAllGalleryItems");
  }

  async getGalleryItemsByCategory(
    category: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{
    data: GalleryItem[];
    total: number;
    hasMore: boolean;
  }> {
    if (limit < 0 || limit > 50) {
      throw new ValidationError("Limit must be between 1 and 50");
    }

    validateId(category, "category");

    return this.withErrorHandling(async () => {
      const [data, totalResult] = await Promise.all([
        this.db.query.galleryItems.findMany({
          where: eq(galleryItems.category, category),
          limit,
          offset,
          orderBy: asc(galleryItems.title),
        }),
        this.db
          .select({ count: count() })
          .from(galleryItems)
          .where(eq(galleryItems.category, category)),
      ]);
      const total = totalResult[0]?.count ?? 0;
      const hasMore = offset + limit < total;

      return { data, total, hasMore };
    }, "getGalleryItemsByCategory");
  }

  async createGalleryItem(data: GalleryItem): Promise<GalleryItem> {
    if (!data.title || !data.imageUrl || !data.description || !data.category) {
      throw new ValidationError("Title, description, and imageUrl are required");
    }

    const sanitizedData = {
      ...data,
      title: sanitizeString(data.title),
      category: data.category ? sanitizeString(data.category) : "uncategorized",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.withErrorHandling(async () => {
      const [item] = await this.db.insert(galleryItems).values(sanitizedData).returning();
      return item;
    }, "createGalleryItem");
  }
}
