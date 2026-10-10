import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import astro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "dist/",
    ".astro/",
    ".wrangler/",
    "playwright-report/",
    "test-results/",
    "blob-report/",
    ".lighthouseci/",
  ]),
  js.configs.recommended,
  tseslint.configs.strict,
  astro.configs.recommended,
  // Config files and scripts run in Node.
  { files: ["*.{js,mjs,ts}", "scripts/**"], languageOptions: { globals: globals.node } },
  // Last, so it switches off any rules that would fight Prettier's formatting.
  prettier,
]);
