- Install Dev Dependencies for automatic class to className. And Other Hygiene factor

```bash
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

```json
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "eslint": "^9.32.0",
    "eslint-config-next": "15.4.4",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
  }
```

- If You Prefer liniting (We Are Using AirBnb Linting Rules)
- Create a `eslint.config.mjs` file in the project root and enter the below contents:

```js
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Convert extends
  ...compat.extends([
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ]),

  // Custom config
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
      "react-refresh": require("eslint-plugin-react-refresh"),
    },
    rules: {
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": ["off", { allowConstantExport: true }],
    },
  },
];
```
