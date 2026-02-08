/**
 * ESLint 9+ flat config for TypeScript and Node.js.
 * Uses TypeScript parser for .ts files; recommended rules from @eslint/js and Prettier.
 */
const path = require("path");
const js = require("@eslint/js");
const prettier = require("eslint-config-prettier");

// Load TypeScript parser from project node_modules (works with pnpm)
let tsParser;
try {
  tsParser = require(path.resolve(process.cwd(), "node_modules/@typescript-eslint/parser"));
} catch {
  tsParser = null;
}

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "writable",
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  prettier,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "drizzle/**",
      "**/*.js",
      "config/openapi/**",
    ],
  },
];
