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
  rules: {
    "linebreak-style": ["error", "unix"],
    "@typescript-eslint/no-explicit-any": "off",
  },
  ignorePatterns: ["components.d.ts"],
};
