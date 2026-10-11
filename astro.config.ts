import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import type { AstroIntegration } from "astro";
import { defineConfig, fontProviders } from "astro/config";
import { existsSync, renameSync, rmdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { site } from "./src/config/site";
import { defaultLocale, locales } from "./src/i18n/locales";

// Cloudflare Pages answers a missing address with the nearest 404.html up the folder tree, so
// /ar/anything gets /ar/404.html. Astro writes src/pages/[lang]/404.astro as
// /<lang>/404/index.html; this moves each one to /<lang>/404.html after the build.
const localizedNotFound: AstroIntegration = {
  name: "localized-not-found",
  hooks: {
    "astro:build:done": ({ dir }) => {
      for (const locale of locales) {
        const folder = fileURLToPath(new URL(`${locale}/404/`, dir));
        const page = `${folder}index.html`;
        if (!existsSync(page)) throw new Error(`The build has no ${locale} 404 page at ${page}`);
        renameSync(page, fileURLToPath(new URL(`${locale}/404.html`, dir)));
        rmdirSync(folder);
      }
    },
  },
};

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
  // only the script it shows, and the layout preloads that file. `optional`: the browser waits
  // briefly for the preloaded font and never swaps it in later, because a late swap re-wraps
  // Arabic headings (the system fallbacks' Arabic is wider) and moved whole pages on CI's
  // Lighthouse (layout shift 0.049). Cached after the first page, it is used everywhere after.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Readex Pro",
      cssVariable: "--font-readex",
      weights: ["400 600"],
      styles: ["normal"],
      subsets: ["latin", "arabic"],
      fallbacks: ["sans-serif"],
      display: "optional",
    },
  ],
  integrations: [mdx(), localizedNotFound],
  vite: { plugins: [tailwindcss()] },
});
