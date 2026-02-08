/**
 * Health check route — mounts GET /health under the API base path.
 * No auth required; suitable for load balancers and CORS preflight.
 */
import { Router } from "express";
import { healthController } from "../controllers";

const router = Router();

router.get("/health", (req, res, next) => {
  healthController.healthCheck(req, res).catch(next);
});
router.get("/live", (req, res, next) => {
  healthController.live(req, res).catch(next);
});
router.get("/ready", (req, res, next) => {
  healthController.ready(req, res).catch(next);
});

export default router;
