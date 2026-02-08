import path from "path";
import express from "express";
import type { ExpressApp } from "../../types/express-app";
import { createServer, type Server } from "http";
import type { RequestListener } from "http";
import { WebSocketServer } from "ws";
import { configureAuth } from "../../config/auth/auth-config";
import { mountApiDocs } from "./api-docs-route";
import { notFoundMiddleware } from "../../middlewares/not-found";

// Import individual route modules
import historyRoutes from "./history-route";
import galleryRoutes from "./gallery-route";
import bookingRoutes from "./bookings-route";
import forumRoutes from "./forum-route";
import contactRoutes from "./contact-route";
import adminRoutes from "./admin-route";
import authRoute from "./auth-routes";
import healthRoute from "./health-check-route";
import userRoute from "./user-profile-route";
import likeRout from "./post_likes-route";

// socket function
import { setupWebSocket } from "./websocket-route";

export async function registerRoutes(basePath: string, app: ExpressApp): Promise<Server> {
  mountApiDocs(app);
  // Serve landing page at GET / (public/index.html)
  app.use(express.static(path.join(process.cwd(), "public"), { index: "index.html" }));
  configureAuth(app);

  // Create HTTP server (app is ExpressApp; at runtime it is a full Express app / RequestListener)
  const httpServer = createServer(app as unknown as RequestListener);

  // Set up WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  setupWebSocket(wss);

  // Register all route modules with the base path
  app.use(basePath, historyRoutes);
  app.use(basePath, galleryRoutes);
  app.use(basePath, bookingRoutes(wss));
  app.use(basePath, forumRoutes(wss));
  app.use(basePath, contactRoutes);
  app.use(basePath, adminRoutes);
  app.use(basePath, authRoute);
  app.use(basePath, healthRoute);
  app.use(basePath, userRoute);
  app.use(basePath, likeRout);

  // 404 for unmatched API routes (Web API standard: consistent JSON error)
  app.use(basePath, notFoundMiddleware);

  // Start the server
  return httpServer;
}
