import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { site } from "./src/config/site";
import { defaultLocale, locales } from "./src/i18n/locales";

export default defineConfig({
  site: site.url,
  // One URL per page, always ending in a slash (/en/features/). Cloudflare Pages serves each page
  // as a folder's index.html and redirects the slashless form, so this matches what it does.
  trailingSlash: "always",
  build: { format: "directory" },
  i18n: {
    locales: [...locales],
    defaultLocale,
    // Both languages get a prefix, and the root stays the language-choice page.
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
});
