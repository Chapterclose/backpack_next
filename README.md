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
```

- make a directory .vscode with filename settings.json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.tslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.run": "onSave",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "path-autocomplete.extensionOnImport": true,
  "path-autocomplete.excludedItems": {
    "*/.js": {
      "when": "**"
    },
    "*/.jsx": {
      "when": "**"
    }
  },
  "javascript.validate.enable": false,
  "typescript.validate.enable": false,

  // extra
  "editor.fontFamily": "Fira Code, Operator Mono",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.cursorBlinking": "expand",
  "editor.cursorStyle": "line",
  "editor.cursorWidth": 2,
  "editor.fontLigatures": true,
  "editor.fontSize": 16.5,
  "editor.lineHeight": 24,
  "editor.detectIndentation": true,
  "editor.wordWrap": "on",

  // terminal
  // "terminal.integrated.fontFamily": "Fira Code, Operator Mono",
  "terminal.integrated.fontSize": 15,

  // file exclude for run node js project in smooth position
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/Thumbs.db": true,
    "**/tmp": true,
    "**/node_modules": true,
    "**/dist": true
  }
}
```
