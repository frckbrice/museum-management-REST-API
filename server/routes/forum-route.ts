import { Router } from "express";
import { WebSocketServer } from "ws";

import { forumController } from "../controllers";
import { requireAuth } from "../../config/auth/auth-config";

export default function forumRoutes(wss: WebSocketServer) {
  const router = Router();

  // Get all posts (public; attendantOnly filter requires auth in controller)
  router.get("/posts", forumController.getAllPosts);

  // Get post by ID (public; attendant-only access enforced in controller)
  router.get("/posts/:id", forumController.getPostById);

  // Create a new post (authenticated per API spec)
  router.post(
    "/posts",
    requireAuth,
    async (req, res) => (await forumController.createPost(req, res))(wss)
  );

  // Add comment to a post (authenticated per API spec)
  router.post(
    "/posts/:id/comments",
    requireAuth,
    async (req, res) => (await forumController.createComment(req, res))(wss)
  );

  // Get comments by post ID
  router.get("/posts/:id/comments", forumController.getCommentsByPostId);

  return router;
}
