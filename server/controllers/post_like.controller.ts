import { Request, Response } from "express";
import { postLikeService } from "../services";

export class PostLikesController {
  async likePost(req: Request, res: Response) {
    try {
      // Use authenticated user (required by route); ignore body userId for security
      const userId = req.user?.id ?? req.body.userId;
      const postId = req.body.postId;

      if (!userId || !postId)
        return res.status(400).json({
          error: true,
          message: "Missing required fields: postId (and authentication for userId)",
        });

      const content = await postLikeService.postLike({ userId, postId });
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to like post with id: " + req.body?.postId });
    }
  }

  async unlikePost(req: Request, res: Response) {
    try {
      const userId = req.user?.id ?? req.body.userId;
      const postId = req.body.postId;

      if (!userId || !postId)
        return res.status(400).json({
          error: true,
          message: "Missing required fields: postId (and authentication for userId)",
        });

      const content = await postLikeService.unlikePost({ userId, postId });
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to unlike post with id: " + req.body?.postId });
    }
  }
}

export const postLikesController = new PostLikesController();
