import { Request, Response } from 'express';
import { userService } from '../services';
import { logger } from '../../config/logger/logger-config';

export class HealthController {
    async healthCheck(req: Request, res: Response) {
        try {
            const isHealthy = await userService.healthCheck();
            logger.debug('Health check performed', { healthy: isHealthy });
            res.json({
                status: isHealthy ? 'healthy' : 'unhealthy',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            logger.error('Health check failed', { error });
            res.status(500).json({
                status: 'unhealthy',
                error: 'Health check failed',
                timestamp: new Date().toISOString()
            });
        }
    }
}

export const healthController = new HealthController();
