import { Router } from "express";
import { healthController } from '../controllers';
import loginLimiter from '../../middlewares/login-limiter';

const router = Router();

//check if the server is running
router
  .get("/health",  healthController.healthCheck);


export default router;

