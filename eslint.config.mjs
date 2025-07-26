/* eslint-disable import/no-anonymous-default-export */
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends(
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime"
  ),

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["dist", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    settings: {
      react: {
        version: "19.1.0",
      },
    },
    plugins: {
      "react-refresh": reactRefreshPlugin,
    },
    rules: {
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": ["off", { allowConstantExport: true }],
    },
  },
];
