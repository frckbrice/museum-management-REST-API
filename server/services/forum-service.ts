// services/forum/forum-service.ts
import { eq, desc, asc, count, sql } from "drizzle-orm";
import { type Post, type Comment } from "../../config/database/schema/schema-types";
import { ValidationError } from "../../middlewares/errors/error-handler";
import { validateId } from "../utils/validations/uuid-validator";
import { sanitizeString } from "../utils/validations/email-validation";
import { BaseService } from "./base-service";
import { comments, posts } from "../../config/database/schema/tables";

export class ForumService extends BaseService {
  async getPostById(id: string): Promise<Post | null> {
    validateId(id, "post id");

    return this.withErrorHandling(async () => {
      const result = await this.db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
          author: {
            columns: {
              id: true,
              username: true,
              email: false,
            },
          },
          comments: {
            with: {
              author: {
                columns: {
                  id: true,
                  username: true,
                  email: false,
                },
              },
            },
            orderBy: asc(comments.createdAt),
          },
        },
      });
      return result || null;
    }, "getPostById");
  }

  async getAllPosts(
    isAttendantOnly?: boolean,
    limit: number = 20,
    offset: number = 0
  ): Promise<{
    data: Post[];
    total: number;
    hasMore: boolean;
  }> {
    return this.withErrorHandling(async () => {
      const whereCondition =
        typeof isAttendantOnly === "boolean"
          ? eq(posts.isAttendantOnly, isAttendantOnly)
          : undefined;

      const [data, totalResult] = await Promise.all([
        this.db.query.posts.findMany({
          where: whereCondition,
          limit,
          offset,
          orderBy: desc(posts.createdAt),
          with: {
            author: {
              columns: {
                id: true,
                fullName: true,
                email: false,
              },
            },
            comments: {
              with: {
                author: {
                  columns: {
                    id: true,
                    username: true,
                    fullName: true,
                    email: false,
                  },
                },
              },
              limit: 3, // Only load first 3 comments for performance
              orderBy: desc(comments.createdAt),
            },
          },
        }),
        this.db
          .select({ count: count() })
          .from(posts)
          .where(whereCondition || sql`true`),
      ]);

      const total = totalResult[0]?.count || 0;
      const hasMore = offset + limit < total;

      return { data, total, hasMore };
    }, "getAllPosts");
  }

  async createPost(data: Omit<Post, "id">) {
    try {
      if (!data.title || !data.content || !data.authorId) {
        throw new ValidationError("Title, content, and authorId are required");
      }

      const sanitizedData: Omit<Post, "id"> = {
        ...data,
        authorId: <string>data?.authorId,
        content: sanitizeString(data.content),
        title: sanitizeString(data.title),
        isAttendantOnly: data.isAttendantOnly || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return this.withErrorHandling(async () => {
        const [post] = await this.db
          .insert(posts)
          .values(sanitizedData as Post)
          .returning();
        return post;
      }, "createPost");
    } catch (error: any) {
      console.log("\n\n error creating post on forum: ", error);
      return { error: error?.message || "Internal Server Error" };
    }
  }

  async getCommentsByPostId(
    postId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    data: Comment[];
    total: number;
    hasMore: boolean;
  }> {
    validateId(postId, "post id");

    return this.withErrorHandling(async () => {
      const [data, totalResult] = await Promise.all([
        this.db.query.comments.findMany({
          where: eq(comments.postId, postId),
          limit,
          offset,
          orderBy: asc(comments.createdAt),
          with: {
            author: {
              columns: {
                id: true,
                username: true,
                email: false,
              },
            },
          },
        }),
        this.db.select({ count: count() }).from(comments).where(eq(comments.postId, postId)),
      ]);

      const total = totalResult[0]?.count || 0;
      const hasMore = offset + limit < total;

      return { data, total, hasMore };
    }, "getCommentsByPostId");
  }

  async createComment(data: Partial<Comment>): Promise<Comment> {
    if (!data.content || !data.authorId || !data.postId) {
      throw new ValidationError("Content, authorId, and postId are required");
    }

    const sanitizedData = {
      ...data,
      content: sanitizeString(data.content),
      authorId: <string>data?.authorId,
    };

    return this.withErrorHandling(async () => {
      const [comment] = await this.db
        .insert(comments)
        .values(sanitizedData as Comment)
        .returning();
      return comment;
    }, "createComment");
  }
}
