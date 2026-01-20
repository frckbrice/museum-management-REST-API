import express from "express";
import { registerRoutes } from "./server/routes";
import cors from "cors";
import corsOptions from "./config/cors/cors-options";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errors/error-handler";
import { getServerConfig } from "./server/utils/helper-function";


dotenv.config();

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// cors
app.use(cors(corsOptions));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api/v1")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  const serverConfig = getServerConfig();

  const server = await registerRoutes("/api/v1", app);

  app.use(errorHandler);

  server.listen(
    PORT,
    () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode`);
      console.log(`🌐 Server URL: ${serverConfig.url}`);
      console.log(`📡 Server is  Listening on ${serverConfig.host}:${serverConfig.port}`);

    }
  );
})();

export default app;
