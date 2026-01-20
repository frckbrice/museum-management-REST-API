import { Request, Response } from 'express';
import { userService } from '../services';

export class HealthController {
    async healthCheck(req: Request, res: Response) {
        console.log("\n\n hit health controller", req.url)
        try {
            const isHealthy = await userService.healthCheck();
            res.json({
                status: isHealthy ? 'healthy' : 'unhealthy',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({
                status: 'unhealthy',
                error: 'Health check failed',
                timestamp: new Date().toISOString()
            });
        }
    }
}

export const healthController = new HealthController();
