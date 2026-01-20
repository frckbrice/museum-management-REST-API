import { Router } from "express";
import { WebSocketServer } from "ws";

import { forumController } from '../controllers';

export default function forumRoutes(wss: WebSocketServer) {
    const router = Router();

    // Get all posts
    router.get("/posts", forumController.getAllPosts);

    // Get post by ID
    router.get("/posts/:id", forumController.getPostById);

    // Create a new post
    router.post("/posts", async (req, res) => (await forumController.createPost(req, res))(wss));

    // Add comment to a post
    router.post("/posts/:id/comments", async (req, res) => (await forumController.createComment(req, res))(wss));

    // get comment by id
    router.get("/posts/:id/comments", forumController.getCommentsByPostId);


    return router;
}
