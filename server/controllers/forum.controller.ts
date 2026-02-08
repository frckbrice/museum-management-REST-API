import { Request, Response } from "express";
import { forumService } from "../services";
import WebSocket, { WebSocketServer } from "ws";
import { insertPostSchema, insertCommentSchema } from "../../config/database/schema/schema-types";
import { z } from "zod";

export class ForumController {
  async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await forumService.getPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user can access attendant-only post
      if (
        post.isAttendantOnly &&
        (!req.isAuthenticated() ||
          (req.user.userType !== "attendant" && req.user.userType !== "admin"))
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to get post" });
    }
  }

  async getAllPosts(req: Request, res: Response) {
    try {
      const { attendantOnly } = req.query;
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined;
      const limit = pageSize || 20; // Default to 50 if not provided
      const offset = page ? (page - 1) * limit : 0; //

      let isAttendantOnly: boolean | undefined;

      if (attendantOnly === "true") {
        // Check if user can access attendant-only posts
        if (
          !req.isAuthenticated() ||
          (req.user.userType !== "attendant" && req.user.userType !== "admin")
        ) {
          return res.status(403).json({ message: "Access denied" });
        }
        isAttendantOnly = true;
      } else if (attendantOnly === "false") {
        isAttendantOnly = false;
      }

      const posts = await forumService.getAllPosts(isAttendantOnly, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  }

  async createPost(req: Request, res: Response) {
    return async (wss: WebSocketServer) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const validatedData = insertPostSchema.parse(req.body);

        // Check if user can create attendant-only posts
        if (
          validatedData.isAttendantOnly &&
          req.user.userType !== "attendant" &&
          req.user.userType !== "admin"
        ) {
          return res
            .status(403)
            .json({ message: "Access denied: must be one of attendant or admin" });
        }

        // Set the user ID from the authenticated user
        validatedData.authorId = req.user.id;

        const now = new Date();
        const post = await forumService.createPost({
          ...validatedData,
          isAttendantOnly: validatedData.isAttendantOnly ?? false,
          createdAt: now,
          updatedAt: now,
          deletedAt: validatedData.deletedAt ?? null,
        });

        // Notify via WebSocket
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "new_post",
                data: post,
              })
            );
          }
        });

        res.status(201).json(post);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ errors: error.errors });
        }
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Failed to create post" });
      }
    };
  }

  async getCommentsByPostId(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
      const limit = pageSize || 20; // Default to 50 if not provided
      const offset = page ? (page - 1) * limit : 0; //

      const comments = await forumService.getCommentsByPostId(postId, limit, offset);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get comments" });
    }
  }

  async createComment(req: Request, res: Response) {
    return async (wss: WebSocketServer) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const { id } = req.params;
        const post = await forumService.getPostById(id);

        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }

        // Check if user can comment on attendant-only post
        if (
          post.isAttendantOnly &&
          req.user.userType !== "attendant" &&
          req.user.userType !== "admin"
        ) {
          return res.status(403).json({ message: "Access denied" });
        }

        const validatedData = insertCommentSchema.parse({
          ...req.body,
          postId: id,
          authorId: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const comment = await forumService.createComment(validatedData);

        // Notify via WebSocket
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "new_comment",
                data: {
                  ...comment,
                  postId: id,
                },
              })
            );
          }
        });

        res.status(201).json(comment);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ errors: error.errors });
        }
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Failed to create comment" });
      }
    };
  }
}

export const forumController = new ForumController();
