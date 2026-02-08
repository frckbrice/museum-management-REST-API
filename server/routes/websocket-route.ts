import { WebSocketServer } from "ws";
import WebSocket from "ws";

export function setupWebSocket(wss: WebSocketServer) {
  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      // Broadcast message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });
  });
}
