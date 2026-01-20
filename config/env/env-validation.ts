import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment variable schema validation
 * This ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Server Configuration
  PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a valid number')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(65535))
    .default('5001'),

  // Database Configuration
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid PostgreSQL connection string')
    .optional(),

  DATABASE_URL_PROD: z
    .string()
    .url('DATABASE_URL_PROD must be a valid PostgreSQL connection string')
    .optional(),

  // Session Configuration
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET must be at least 32 characters long')
    .default('museum_secret_development_only_change_in_production'),

  // CORS Configuration
  FRONTEND_URL: z
    .string()
    .url('FRONTEND_URL must be a valid URL')
    .default('http://localhost:3000'),

  API_PROD_URL: z
    .string()
    .url('API_PROD_URL must be a valid URL')
    .optional(),

  // Cloudinary Configuration (optional, only needed if using file uploads)
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, 'CLOUDINARY_CLOUD_NAME is required if using Cloudinary')
    .optional(),

  CLOUDINARY_API_KEY: z
    .string()
    .min(1, 'CLOUDINARY_API_KEY is required if using Cloudinary')
    .optional(),

  CLOUDINARY_API_SECRET: z
    .string()
    .min(1, 'CLOUDINARY_API_SECRET is required if using Cloudinary')
    .optional(),
}).refine(
  (data) => {
    // At least one database URL must be provided
    return !!(data.DATABASE_URL || data.DATABASE_URL_PROD);
  },
  {
    message: 'Either DATABASE_URL or DATABASE_URL_PROD must be provided',
    path: ['DATABASE_URL'],
  }
).refine(
  (data) => {
    // In production, API_PROD_URL is required
    if (data.NODE_ENV === 'production' && !data.API_PROD_URL) {
      return false;
    }
    return true;
  },
  {
    message: 'API_PROD_URL is required in production environment',
    path: ['API_PROD_URL'],
  }
).refine(
  (data) => {
    // If any Cloudinary env var is set, all must be set
    const cloudinaryVars = [
      data.CLOUDINARY_CLOUD_NAME,
      data.CLOUDINARY_API_KEY,
      data.CLOUDINARY_API_SECRET,
    ];
    const hasSome = cloudinaryVars.some((v) => v !== undefined);
    const hasAll = cloudinaryVars.every((v) => v !== undefined);
    return !hasSome || hasAll;
  },
  {
    message: 'All Cloudinary environment variables must be provided together',
    path: ['CLOUDINARY_CLOUD_NAME'],
  }
);

/**
 * Validated environment variables
 * This will throw an error at startup if any required env vars are missing or invalid
 */
export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env;

try {
  validatedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors.map((err) => {
      const path = err.path.join('.');
      return `  - ${path}: ${err.message}`;
    }).join('\n');

    console.error('\n❌ Environment variable validation failed:\n');
    console.error(errorMessages);
    console.error('\nPlease check your .env file and ensure all required variables are set correctly.\n');
    process.exit(1);
  }
  throw error;
}

/**
 * Get validated environment variables
 * Use this instead of accessing process.env directly
 */
export const env = validatedEnv;

/**
 * Helper to check if we're in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper to check if we're in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Helper to check if we're in test
 */
export const isTest = env.NODE_ENV === 'test';
