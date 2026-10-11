import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { iconNames } from "./components/icons";

// One collection per page, one file per language named after it (`en.yaml`, `ar.yaml`): the two
// files are the same page, and a page route fails the build when either is missing. Copy writes
// the product's name as `{brand}` (src/i18n/brand.ts). Screenshots are real Hala screens in
// src/assets/screens/, referenced by relative path so the build checks they exist.
const perLanguage = (folder: string) =>
  glob({ base: `./src/content/${folder}`, pattern: "{en,ar}.yaml" });

const text = z.string().min(1);
const seo = { title: text, description: text };
const screenshot = ({ image }: SchemaContext) =>
  z.object({
    src: image(),
    alt: text,
    /** Shown under the image, e.g. that the dashboard is in English. */
    caption: text.optional(),
  });

const home = defineCollection({
  loader: perLanguage("home"),
  schema: (context) =>
    z.object({
      ...seo,
      hero: z.object({
        heading: text,
        lead: text,
        secondaryCta: text,
        image: screenshot(context),
      }),
      audiences: z.object({
        heading: text,
        items: z.array(z.object({ icon: z.enum(iconNames), name: text, text })).min(1),
      }),
      steps: z.object({
        heading: text,
        items: z.array(z.object({ heading: text, text })).length(3),
        image: screenshot(context),
      }),
      proofs: z.object({
        heading: text,
        sources: z.object({ heading: text, text, image: screenshot(context) }),
        confirmation: z.object({ heading: text, text, image: screenshot(context) }),
        doubleBookings: z.object({ heading: text, text }),
      }),
      closing: z.object({ heading: text, text }),
    }),
});

const feature = (context: SchemaContext) =>
  z.object({ heading: text, text, points: z.array(text).default([]), image: screenshot(context) });

const features = defineCollection({
  loader: perLanguage("features"),
  schema: (context) =>
    z.object({
      ...seo,
      intro: z.object({ heading: text, lead: text }),
      answers: feature(context),
      booking: feature(context),
      languages: z.object({
        heading: text,
        text,
        images: z.array(screenshot(context)).length(2),
      }),
      inbox: feature(context),
      costs: feature(context),
      privacy: z.object({ heading: text, text, points: z.array(text).min(1) }),
      closing: z.object({ heading: text, text }),
    }),
});

export const collections = { home, features };
