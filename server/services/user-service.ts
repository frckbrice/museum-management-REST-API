// services/user/user-service.ts
import { eq, desc, sql, count } from "drizzle-orm";
import { type User } from "../../config/database/schema/schema-types";
import { validateId, generateUUID } from "../../server/utils/validations/uuid-validator";
import { NotFoundError, ValidationError } from "../../middlewares/errors/error-handler";
import { sanitizeString, validateEmail } from "../../server/utils/validations/email-validation";
import { BaseService } from "./base-service";
import schema from "../../config/database/schema/tables";

const { users } = schema;

export class UserService extends BaseService {

    async getUser(id: string): Promise<User | null> {
        const validatedId = validateId(id, 'user id');

        return this.withErrorHandling<User | null>(async () => {
            const result = await this.db.query.users.findFirst({
                where: eq(users.id, validatedId)
            });
            return result || null;
        }, 'getUser');
    }

    // delete user by Email
    async deleteUserByEmail(email: string): Promise<void> {
        validateEmail(email);

        // check if the user exists
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new NotFoundError('User', email);
        }

        return this.withErrorHandling(async () => {
            const result = await this.db.delete(users).where(eq(users.email, email));
            if (result.rowCount === 0) {
                throw new NotFoundError('User', email);
            }
            return;
        }, 'deleteUserByEmail');

    }

    // delete user by id
    async deleteUserById(id: string): Promise<void> {
        validateId(id, 'user id');

        // check if the user exists
        const user = await this.getUser(id);
        if (!user) {
            throw new NotFoundError('User', id);
        }

        return this.deleteUserByEmail(user.email);
    }


    async getUserByUsername(username: string): Promise<User | null> {
        if (!username) {
            throw new ValidationError('Username must be a non-empty string');
        }

        const sanitizedUsername = sanitizeString(username.toLowerCase());

        return this.withErrorHandling(async () => {
            const result = await this.db.query.users.findFirst({
                where: eq(users.username, sanitizedUsername)
            });
            return result || null;
        }, 'getUserByUsername');
    }

    async getUserByEmail(email: string): Promise<User | null> {
        validateEmail(email);

        const sanitizedEmail = sanitizeString(email.toLowerCase());

        return this.withErrorHandling(async () => {
            const result = await this.db.query.users.findFirst({
                where: eq(users.email, sanitizedEmail)
            });
            return result || null;
        }, 'getUserByEmail');
    }

    async createUser(userData: User): Promise<User> {
        if (!userData.username || !userData.email) {
            throw new ValidationError('Username and email are required');
        }

        if (!userData.password) {
            throw new ValidationError('Password is required');
        }
        validateEmail(userData.email);

        const sanitizedData = {
            ...userData,
            username: sanitizeString(userData.username.toLowerCase()),
            email: sanitizeString(userData.email.toLowerCase()),
        };

        return this.withErrorHandling(async () => {
            // Check for existing user
            const existingUser = await this.getUserByEmail(sanitizedData.email) ||
                await this.getUserByUsername(sanitizedData.username);

            if (existingUser) {
                throw new ValidationError('User with this email or username already exists');
            }

            // Ensure all required fields are present and generate an id if missing
            const userToInsert = {
                ...sanitizedData,
                id: sanitizedData.id ?? generateUUID(),
                createdAt: sanitizedData.createdAt ?? new Date(),
                updatedAt: sanitizedData.updatedAt ?? new Date(),
                password: sanitizedData.password ?? '',
                fullName: <string>sanitizedData.fullName,
                userType: sanitizedData.userType,
                profileImage: sanitizedData.profileImage ?? null,
                bio: sanitizedData.bio ?? null
            };
            const [user] = await this.db.insert(users).values(userToInsert).returning();
            return user;
        }, 'createUser');
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User> {
        const validatedId = validateId(id, 'user id');

        if (Object.keys(userData).length === 0) {
            throw new ValidationError('No data provided for update');
        }

        const sanitizedData: Partial<User> = {
            ...userData,
        };

        if (userData.email) {
            validateEmail(userData.email);
            sanitizedData.email = sanitizeString(userData.email.toLowerCase());
        }

        if (userData.username) {
            sanitizedData.username = sanitizeString(userData.username.toLowerCase());
        }

        return this.withErrorHandling(async () => {
            const [updatedUser] = await this.db
                .update(users)
                .set(sanitizedData)
                .where(eq(users.id, validatedId))
                .returning();

            if (!updatedUser) {
                throw new NotFoundError('User', validatedId);
            }

            return updatedUser;
        }, 'updateUser');
    }

    // get all users
    async getAllUsers(
        limit: number = 20,
        offset: number = 0,
        role?: "visitor" | "attendant" | "admin" | undefined
    ): Promise<{ data: User[]; total: number; hasMore: boolean }> {
        try {
            const whereClause = role ? eq(users.userType, role) : sql`true`;
            return this.withErrorHandling(async () => {

                const [data, totalResult] = await Promise.all([
                    this.db.query.users.findMany({
                        where: whereClause,
                        limit,
                        offset,
                        orderBy: desc(users.createdAt)
                    }),
                    this.db.select({ count: count() })
                        .from(users)
                        .where(whereClause)
                ]);

                const total = totalResult[0]?.count || 0;
                const hasMore = offset + limit < total;
                console.log("\n\n total: ", total, data)
                return { data, total, hasMore };
            }, 'getAllUsers');
        } catch (error) {
            console.error('\n\n 💥💥💥💥💥Error in getAllUsers:', error);
            throw error;
        }
    }
    //     async getAllUsers(
    //         limit: number = 20,
    //         offset: number = 0,
    //         role?: "visitor" | "attendant" | "admin" | undefined
    //     ): Promise<{ data: User[]; total: number; hasMore: boolean }> {
    //         try {
    //         console.log('\n\n=== START DEBUGGING getAllUsers ===');
    //         console.log('Input parameters:', { limit, offset, role });

    //         return this.withErrorHandling(async () => {
    //         // Debug: Show the generated where clause
    //             const whereClause = role ? eq(users.userType, role) : sql`true`;
    //             console.log('Generated where clause:', whereClause);

    //             // Debug: Show the actual SQL being generated
    //             const dataQuery = this.db.query.users.findMany({
    //                 where: whereClause,
    //                 limit,
    //                 offset,
    //                 orderBy: desc(users.createdAt)
    //             });
    //             console.log('Data query SQL:', dataQuery.toSQL());

    //             const countQuery = this.db.select({ count: count() })
    //                 .from(users)
    //                 .where(whereClause);
    //             console.log('Count query SQL:', countQuery.toSQL());

    //             const [data, totalResult] = await Promise.all([
    //                 dataQuery,
    //                 countQuery
    //             ]);

    //             console.log('Raw data results:', data);
    //             console.log('Raw count results:', totalResult);

    //             const total = totalResult[0]?.count || 0;
    //             const hasMore = offset + limit < total;

    //             console.log('Final response:', { data, total, hasMore });
    //             console.log('=== END DEBUGGING ===\n\n');

    //             return { data, total, hasMore };
    //         }, 'getAllUsers');
    //     } catch (error) {
    //            console.error('\n\n 💥 Error in getAllUsers:', error);
    //            throw error;
    //        }
    //    }
}
// function count() {
//     // Returns a SQL fragment for COUNT(*)
//     return sql<number>`count(*)`;
// }

