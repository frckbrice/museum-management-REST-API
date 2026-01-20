// services/history/history-service.ts
import { eq, desc, count } from "drizzle-orm";
import { type HistoryContent } from "../../../config/database/schema/schema-types";
import { validateId } from "../../utils/validations/uuid-validator";
import { sanitizeString, slugify } from "../../utils/validations/email-validation";

import { NotFoundError, ValidationError } from "../../../middlewares/errors/error-handler";
import { BaseService } from "../base-service";
import { historyContent } from "../../../config/database/schema/tables";

export class HistoryService extends BaseService {

    async getHistoryContentById(id: string): Promise<HistoryContent | null> {
        validateId(id, 'history content id');

        console.log("\n\n 💥💥💥💥💥getHistoryContentById id: ", id);

        return this.withErrorHandling(async () => {
            const result = await this.db.query.historyContent.findFirst({
                where: eq(historyContent.id, id),
                with: {
                    author: {
                        columns: {
                            id: true,
                            username: true,
                            email: false
                        }
                    }
                }
            });
            console.log("\n\n 💥💥💥💥💥getHistoryContentById result: ", result);
            return result || null;
        }, 'getHistoryContentById');
    }

    async getHistoryContentBySlug(slug: string): Promise<HistoryContent | null> {

        if (!slug || typeof slug !== 'string') {
            throw new ValidationError('Slug must be a non-empty string');
        }

        const sanitizedSlug = sanitizeString(slug.toLowerCase());

        return this.withErrorHandling(async () => {
            const result = await this.db.query.historyContent.findFirst({
                where: eq(historyContent.slug, sanitizedSlug),
                with: {
                    author: {
                        columns: {
                            id: true,
                            username: true,
                            email: false
                        }
                    }
                }
            });
            return result || null;
        }, 'getHistoryContentBySlug');
    }

    async getAllHistoryContent(limit: number = 50, offset: number = 0): Promise<{
        data: HistoryContent[];
        total: number;
        hasMore: boolean;
    }> {

        if (limit < 1 || limit > 100) {
            throw new ValidationError('Limit must be between 1 and 100');
        }

        if (offset < 0) {
            throw new ValidationError('Offset must be non-negative');
        }

        return this.withErrorHandling(async () => {
            const [data, totalResult] = await Promise.all([
                this.db.query.historyContent.findMany({
                    limit,
                    offset,
                    orderBy: desc(historyContent.createdAt),
                    with: {
                        author: {
                            columns: {
                                id: true,
                                username: true,
                                email: false
                            }
                        }
                    }
                }),
                this.db.select({ count: count() }).from(historyContent)
            ]);

            const total = totalResult[0]?.count || 0;
            const hasMore = offset + limit < total;

            return { data, total, hasMore };
        }, 'getAllHistoryContent');
    }

    async createHistoryContent(data: HistoryContent): Promise<HistoryContent> {
        if (!data.title || !data.content || !data.authorId || !data.metaDescription || !data.keywords) {
            throw new ValidationError('Title, content, and authorId are required');
        }

        const sanitizedData = {
            ...data,
            title: sanitizeString(data.title),
            slug: data.slug ? sanitizeString(data.slug.toLowerCase()) :
                sanitizeString(slugify(data.title)),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            return this.withErrorHandling(async () => {
                // Check for duplicate slug
                const existingContent = await this.getHistoryContentBySlug(sanitizedData.slug);
                if (existingContent) {
                    sanitizedData.slug = `${sanitizedData.slug}-${Date.now()}`;
                }

                const [content] = await this.db.insert(historyContent).values(sanitizedData).returning();
                return content;
            }, 'createHistoryContent');
        } catch (error) {
            console.error('\n\n 💥💥💥💥💥Error in createHistoryContent:', error);
            throw new Error('Failed to create history content');
        }
    }

    async updateHistoryContent(id: string, data: Partial<HistoryContent>): Promise<HistoryContent> {
        try {
            validateId(id, 'history content id');

            if (Object.keys(data).length === 0) {
                throw new ValidationError('No data provided for update');
            }

            const sanitizedData: Partial<HistoryContent> = {
                ...data,
                updatedAt: new Date()
            };

            if (data.slug) {
                sanitizedData.slug = sanitizeString(data.slug.toLowerCase());
            }

            if (data.title) {
                sanitizedData.title = sanitizeString(data.title);

                if (!data.slug) {
                    sanitizedData.slug = sanitizeString(slugify(data?.title));
                }
            }

            // check if this history exists first
            const history = await this.getHistoryContentById(id);
            if (!history) {
                throw new NotFoundError('History content', id);
            }


            return this.withErrorHandling(async () => {
                const [updatedContent] = await this.db
                    .update(historyContent)
                    .set(sanitizedData)
                    .where(eq(historyContent.id, id))
                    .returning();

                if (!updatedContent) {
                    throw new NotFoundError('History content', id);
                }

                return updatedContent;
            }, 'updateHistoryContent',
                { preserveErrors: [ValidationError, NotFoundError] }); // 👈 Preserve specific error types
        } catch (error) {
            console.error('\n\n 💥💥💥💥💥Error in updateHistoryContent:', error);
            throw new Error('Failed to update history content');
        }
    }

    // delete an history
    async deleteHistoryContent(id: string): Promise<void> {
        try {
            validateId(id, 'history content id');

            return this.withErrorHandling(
                async () => {
                    validateId(id, 'history content id');

                    const history = await this.getHistoryContentById(id);
                    if (!history) {
                        throw new NotFoundError('History content', id);
                    }

                    const result = await this.db.delete(historyContent)
                        .where(eq(historyContent.id, id));

                    if (result.rowCount === 0) {
                        throw new NotFoundError('History content', id);
                    }
                },
                'deleteHistoryContent',
                { preserveErrors: [NotFoundError] }  // 👈 This preserves NotFoundError
            );
        } catch (error) {
            console.error('\n\n 💥💥💥💥💥Error in deleteHistoryContent:', error);
            throw new Error('Failed to delete history content');
        }
    }
}
