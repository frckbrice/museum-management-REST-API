/**
 * Entry point — validate env, create app, register routes, start server.
 * App is built in a modular way so it can be tested without listening
 * and domains can be split into microservices later.
 */
// Validate env first (throws and exits if invalid)
import { env } from "./config/env/env-validation";
import { createApp } from "./app";
import { registerRoutes } from "./server/routes";
import errorHandler from "./middlewares/errors/error-handler";
import { logger } from "./config/logger/logger-config";

const PORT = env.PORT;

// Log uncaught errors so nodemon shows why the process exited
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at", promise, "reason:", reason);
  process.exit(1);
});

(async () => {
  try {
    const app = createApp();
    const server = await registerRoutes("/api/v1", app);
    app.use(errorHandler);

    server.listen(PORT, () => {
      logger.info("Server started successfully", {
        mode: env.NODE_ENV,
        port: PORT,
        basePath: "/api/v1",
      });
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();

export default createApp;
