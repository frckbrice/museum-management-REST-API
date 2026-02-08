import { Router } from "express";
import { postLikesController } from "../controllers";
import { requireAuth } from "../../config/auth/auth-config";

const router = Router();

// Like a post (authenticated per API spec)
router.post("/post_likes", requireAuth, postLikesController.likePost);

// Unlike a post (authenticated per API spec)
router.delete("/post_likes", requireAuth, postLikesController.unlikePost);

export default router;
