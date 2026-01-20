import express from "express";
import { registerRoutes } from "./server/routes";
import cors from "cors";
import corsOptions from "./config/cors/cors-options";
import errorHandler from "./middlewares/errors/error-handler";
import { getServerConfig } from "./server/utils/helper-function";
import { env } from "./config/env/env-validation";
import { requestLogger } from "./middlewares/logger";
import { logger } from "./config/logger/logger-config";
import { requestIdMiddleware } from "./middlewares/request-id";

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;

const app = express();

// Request ID middleware - should be early in the middleware chain
app.use(requestIdMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// cors
app.use(cors(corsOptions));

// Request logging middleware
app.use(requestLogger);

(async () => {
  const serverConfig = getServerConfig();

  const server = await registerRoutes("/api/v1", app);

  app.use(errorHandler);

  server.listen(
    PORT,
    () => {
      logger.info('Server started successfully', {
        mode: NODE_ENV,
        url: serverConfig.url,
        host: serverConfig.host,
        port: serverConfig.port,
      });
    }
  );
})();

export default app;
