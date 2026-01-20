import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { configureAuth } from "../../config/auth/auth-config";

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


export async function registerRoutes(basePath: string, app: Express): Promise<Server> {
    // Set up authentication routes
    configureAuth(app);


    // Create HTTP server
    const httpServer = createServer(app);

    // Set up WebSocket server for real-time features
    const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

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

    // Start the server
    return httpServer;
}
