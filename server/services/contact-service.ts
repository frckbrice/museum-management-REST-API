// services/contact/contact-service.ts
import { eq, desc, count } from "drizzle-orm";
import { type ContactMessage } from "../../config/database/schema/schema-types";
import { NotFoundError, ValidationError } from "../../middlewares/errors/error-handler";
import { validateId } from "../../server/utils/validations/uuid-validator";
import { sanitizeString, validateEmail } from "../../server/utils/validations/email-validation";
import { BaseService } from "./base-service";
import { contactMessages } from "../../config/database/schema/tables";

export class ContactService extends BaseService {

    async getAllContactMessages(limit: number = 50, offset: number = 0): Promise<{
        data: ContactMessage[];
        total: number;
        hasMore: boolean;
    }> {
        return this.withErrorHandling(async () => {
            const [data, totalResult] = await Promise.all([
                this.db.query.contactMessages.findMany({
                    limit,
                    offset,
                    orderBy: desc(contactMessages.createdAt),
                    with: {
                        user: {
                            columns: {
                                id: true,
                                fullName: true,
                                email: true
                            }
                        }
                    }
                }),
                this.db.select({ count: count() }).from(contactMessages)
            ]);

            const total = totalResult[0]?.count || 0;
            const hasMore = offset + limit < total;

            return { data, total, hasMore };
        }, 'getAllContactMessages');
    }

    async createContactMessage(data: Partial<ContactMessage>): Promise<ContactMessage> {
        if (!data.fullName || !data.email || !data.message || !data.subject) {
            throw new ValidationError('Name, subject, email, and message are required');
        }

        validateEmail(data.email);

        const sanitizedData = {
            ...data,
            name: sanitizeString(data.fullName),
            email: sanitizeString(data.email.toLowerCase()),
            message: sanitizeString(data.message),
            isRead: false,
            createdAt: new Date()
        };

        return this.withErrorHandling(async () => {
            const [message] = await this.db.insert(contactMessages).values(sanitizedData as ContactMessage).returning();
            return message;
        }, 'createContactMessage');
    }

    async markContactMessageAsRead(id: string): Promise<ContactMessage> {
        validateId(id, 'contact message id');

        return this.withErrorHandling(async () => {
            const [updatedMessage] = await this.db
                .update(contactMessages)
                .set({ isRead: true })
                .where(eq(contactMessages.id, id))
                .returning();

            if (!updatedMessage) {
                throw new NotFoundError('Contact message', id);
            }

            return updatedMessage;
        }, 'markContactMessageAsRead');
    }

    // Bulk operations for better performance
    async getUnreadContactMessagesCount(): Promise<number> {
        return this.withErrorHandling(async () => {
            const result = await this.db
                .select({ count: count() })
                .from(contactMessages)
                .where(eq(contactMessages.isRead, false));

            return result[0]?.count || 0;
        }, 'getUnreadContactMessagesCount');
    }
}