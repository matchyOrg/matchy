/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
    "./.eslintrc-auto-import.json",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    "@typescript-eslint/no-explicit-any": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["*.js"],
            message: "Remove the .js file extension.",
          },
        ],
      },
    ],
  },
  ignorePatterns: [
    "src/components.d.ts",
    "src/auto-imports.d.ts",
    "src/services/supabase-types.ts",
  ],
};
