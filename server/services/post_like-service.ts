// services/postLikespostLikesservice.ts
import { eq, and } from "drizzle-orm";
import { PostLike } from "../../config/database/schema/schema-types";
import { BaseService } from "./base-service";
import { validateId } from "../../server/utils/validations/uuid-validator";
import { postLikes } from "../../config/database/schema/tables";

export class PostLikeService extends BaseService {

    async postLike(data: PostLike) {
        try {
            validateId(data?.userId, 'user id');
            validateId(data?.postId, 'post id');


            return this.withErrorHandling(async () => {
                const result = await this.db.insert(postLikes).values(data).returning();
                return result || null;
            }, 'getBookingById');
        } catch (error) {
            console.error(error);
            throw new Error(` error creating like for post id : ${data?.postId} created by user id : ${data?.userId}`)
        }
    }


    // update the like to becone unlike
    async unlikePost(data: PostLike) {
        try {
            validateId(data?.userId, 'user id');
            validateId(data?.postId, 'post id');
            return this.withErrorHandling(async () => {
                const result = await this.db
                    .delete(postLikes)
                    .where(
                        and(
                            eq(postLikes.userId, data.userId),
                            eq(postLikes.postId, data.postId)
                        )
                    )
                    .returning();
                return result || null;
            }, "unlikePost");
        } catch (error) {
            console.error(error);
            throw new Error(` error deleting like for post id : ${data?.postId} created by user id : ${data?.userId}`)
        }

    }


}
