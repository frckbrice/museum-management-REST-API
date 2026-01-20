import { Request, Response } from 'express';
import { postLikeService } from '../services';

export class PostLikesController {
    async likePost(req: Request, res: Response) {
        try {
            const data = req.body;

            if (!data.userId || !data.postId)
                return res.status(400).send({
                    error: true,
                    message: "Missing required fields post id and author id"
                });


            const content = await postLikeService.postLike(data);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed like a post with id: ' + req.body.postId });
        }
    }

    async unlikePost(req: Request, res: Response) {
        const data = req.body;

        if (!data.userId || !data.postId)
            return res.status(400).send({
                error: true,
                message: "Missing required fields post id and author id"
            });


        try {
            const content = await postLikeService.unlikePost(data);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to unlike a post with id: ' + req.body.postId });
        }
    }


}


export const postLikesController = new PostLikesController();
