import helmet from 'helmet';
import { Express } from 'express';

/**
 * Configure Helmet.js security headers
 * Helmet helps secure Express apps by setting various HTTP headers
 */
export const configureHelmet = (app: Express) => {
    app.use(
        helmet({
            // Content Security Policy
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                },
            },
            // Cross-Origin Embedder Policy
            crossOriginEmbedderPolicy: false, // Set to true if you don't need to embed external resources
            // Cross-Origin Opener Policy
            crossOriginOpenerPolicy: { policy: 'same-origin' },
            // Cross-Origin Resource Policy
            crossOriginResourcePolicy: { policy: 'cross-origin' },
            // DNS Prefetch Control
            dnsPrefetchControl: true,
            // Expect-CT (deprecated but kept for compatibility)
            expectCt: false,
            // Frameguard - prevents clickjacking
            frameguard: { action: 'deny' },
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
            referrerPolicy: { policy: 'no-referrer' },
            // XSS Protection (legacy, but kept for older browsers)
            xssFilter: true,
        })
    );
};

export default configureHelmet;
