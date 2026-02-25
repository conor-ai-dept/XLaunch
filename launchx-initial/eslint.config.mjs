import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // Global ignores
  {
    ignores: ["**/dist/", "**/node_modules/"],
  },

  // Base JS recommended rules
  eslint.configs.recommended,

  // TypeScript recommended rules (type-aware)
  ...tseslint.configs.recommended,

  // Prettier disables conflicting formatting rules
  eslintConfigPrettier,

  // Project-specific overrides
  {
    files: ["packages/*/src/**/*.ts"],
    rules: {
      // Warn on any — goal is to eliminate over time
      "@typescript-eslint/no-explicit-any": "warn",

      // Allow unused vars prefixed with _ (common pattern for Express req/res)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // No console in production code (warn, not error — there's a lot of it currently)
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  }
);
