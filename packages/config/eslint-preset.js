/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // TypeScript handles these
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],

    // Allow explicit any sparingly but warn
    "@typescript-eslint/no-explicit-any": "warn",

    // Consistency
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports" },
    ],

    // No console in production code
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // Prefer const
    "prefer-const": "error",

    // No var
    "no-var": "error",
  },
  ignorePatterns: ["dist", "node_modules", ".turbo", "coverage"],
};
