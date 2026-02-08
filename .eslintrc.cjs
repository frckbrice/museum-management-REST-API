/**
 * ESLint config for TypeScript and Node.js (ESLint 8 compatible).
 * Ensures consistent style and catches common issues before push/CI.
 */
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: ["node_modules", "dist", "*.js", "drizzle", "config/openapi"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-require-imports": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
};
