import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Page copy, one folder per language (en/home.mdx and ar/home.mdx are the same page). Titles and
// descriptions write the product's name as `{brand}` (src/i18n/brand.ts).
const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

export const collections = { pages };
