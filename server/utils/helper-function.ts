import dotenv from "dotenv";
dotenv.config();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5001;


// Environment-based configuration
export const getServerConfig = () => {
    if (NODE_ENV === 'production') {
        const API_PROD_URL = process.env.API_PROD_URL;
        if (!API_PROD_URL) {
            throw new Error('API_PROD_URL environment variable is required in production');
        }

        // Parse the production URL to extract host and port
        const url = new URL(API_PROD_URL);
        return {
            host: url.hostname,
            port: url.port ? parseInt(url.port) : (url.protocol === 'https:' ? 443 : 80),
            url: API_PROD_URL
        };
    } else {
        // Development configuration
        return {
            host: 'localhost',
            port: PORT,
            url: `http://localhost:${PORT}`
        };
    }
};
