import { Request, Response } from 'express';
import { historyService } from '../services';

export class HistoryController {
    async getHistoryContentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            console.log("\n\n 💥💥💥💥💥getHistoryContentById id: ", id);

            const content = await historyService.getHistoryContentById(id);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get history content' });
        }
    }

    async getHistoryContentBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const content = await historyService.getHistoryContentBySlug(slug);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get history content by slug' });
        }
    }

    async getAllHistoryContent(req: Request, res: Response) {
        try {
            const page = req.query?.page ? Number(req.query?.page as string) : 1;
            const pageSize = req.query?.pageSize ? Number(req.query.pageSize as string) : 20;
            const limit = pageSize; // Default to 50 if not provided
            const offset = page ? (page - 1) * limit : 0; //

            const content = await historyService.getAllHistoryContent(limit, offset);

            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get all history content' });
        }
    }

    async createHistoryContent(req: Request, res: Response) {
        try {
            const data = req.body;
            const content = await historyService.createHistoryContent(data);
            res.status(201).json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create history content' });
        }
    }

    async updateHistoryContent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;
            const content = await historyService.updateHistoryContent(id, data);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update history content' });
        }
    }

    // delete an history
    async deleteHistoryContent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await historyService.deleteHistoryContent(id);
            res.json({ message: 'History content deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete history content' });
        }
    }
}


export const historyController = new HistoryController();
