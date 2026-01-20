import { env } from "../../config/env/env-validation";

// Environment-based configuration
export const getServerConfig = () => {
    if (env.NODE_ENV === 'production') {
        if (!env.API_PROD_URL) {
            throw new Error('API_PROD_URL environment variable is required in production');
        }

        // Parse the production URL to extract host and port
        const url = new URL(env.API_PROD_URL);
        return {
            host: url.hostname,
            port: url.port ? parseInt(url.port) : (url.protocol === 'https:' ? 443 : 80),
            url: env.API_PROD_URL
        };
    } else {
        // Development configuration
        return {
            host: 'localhost',
            port: env.PORT,
            url: `http://localhost:${env.PORT}`
        };
    }
};
