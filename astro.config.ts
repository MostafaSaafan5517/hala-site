import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
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
  // Readex Pro, Hala's one typeface for Latin and Arabic (Hala's DESIGN.md, Type). Astro downloads
  // it at build time and serves it from this site: one variable file per script, so a page loads
  // only the script it shows. Fallback metrics are generated so nothing shifts when it arrives.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Readex Pro",
      cssVariable: "--font-readex",
      weights: ["400 600"],
      styles: ["normal"],
      subsets: ["latin", "arabic"],
      fallbacks: ["sans-serif"],
    },
  ],
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
});
