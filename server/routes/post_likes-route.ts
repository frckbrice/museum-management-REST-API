// routes/user.routes.ts
import { Router } from "express";
import { postLikesController } from "../controllers";

const router = Router();

router.post("/post_likes", postLikesController.likePost);
router.delete("/post_likes", postLikesController.unlikePost);

export default router;
