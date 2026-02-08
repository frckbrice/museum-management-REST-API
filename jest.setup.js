// Ensure minimal env for tests (env-validation runs on first config import)
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/test_db";
process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET || "test-secret-at-least-32-characters-long";
// In test, force a valid optional URL so env-validation never fails on API_PROD_URL
process.env.API_PROD_URL = "http://localhost:5001";
