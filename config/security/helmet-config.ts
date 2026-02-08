import helmet from "helmet";
import type { ExpressApp } from "../../types/express-app";

const helmetOptions = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "https://images.unsplash.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Set to true if you don't need to embed external resources
  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: "same-origin" },
  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: "cross-origin" },
  // DNS Prefetch Control
  dnsPrefetchControl: true,
  // Frameguard - prevents clickjacking
  frameguard: { action: "deny" },
  // Hide Powered-By header
  hidePoweredBy: true,
  // HSTS - HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  // IE No Open
  ieNoOpen: true,
  // No Sniff - prevents MIME type sniffing
  noSniff: true,
  // Origin Agent Cluster
  originAgentCluster: true,
  // Permissions Policy (formerly Feature Policy)
  permissionsPolicy: {
    features: {
      accelerometer: ["'none'"],
      ambientLightSensor: ["'none'"],
      autoplay: ["'none'"],
      battery: ["'none'"],
      camera: ["'none'"],
      crossOriginIsolated: ["'none'"],
      displayCapture: ["'none'"],
      documentDomain: ["'none'"],
      encryptedMedia: ["'none'"],
      executionWhileNotRendered: ["'none'"],
      executionWhileOutOfViewport: ["'none'"],
      fullscreen: ["'self'"],
      geolocation: ["'none'"],
      gyroscope: ["'none'"],
      keyboardMap: ["'none'"],
      magnetometer: ["'none'"],
      microphone: ["'none'"],
      midi: ["'none'"],
      navigationOverride: ["'none'"],
      payment: ["'none'"],
      pictureInPicture: ["'none'"],
      publickeyCredentials: ["'none'"],
      screenWakeLock: ["'none'"],
      syncXhr: ["'none'"],
      usb: ["'none'"],
      webShare: ["'none'"],
      xrSpatialTracking: ["'none'"],
    },
  },
  // Referrer Policy
  referrerPolicy: { policy: "no-referrer" },
  // XSS Protection (legacy, but kept for older browsers)
  xssFilter: true,
};

export const configureHelmet = (app: ExpressApp) => {
  app.use(helmet(helmetOptions as Parameters<typeof helmet>[0]));
};

export default configureHelmet;
