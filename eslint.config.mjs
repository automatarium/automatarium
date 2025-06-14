import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["**/node_modules/", "**/dist/", "**/src/hooks/useEgg.ts"]),
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  { settings: { react: { version: "detect", defaultVersion: ""} } }, 
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'], // As we're using React 17+, and are in a NEXT.js project, enabling this rule is reccomended
  { rules: {"react/prop-types": 0, "react/display-name": 0, "prefer-const": 0} } // These rules moreso relate to good practices, but it tends to throw errors which can't be fixed on this codebase
]);
