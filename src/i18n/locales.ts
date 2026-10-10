// The site's languages. Both are equals: each has its own prefix (/en/, /ar/) and neither is
// served at the root, which is a page where the visitor chooses (src/pages/index.astro).

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

/** Astro's i18n config needs one; with every language prefixed it only affects fallbacks. */
export const defaultLocale: Locale = "en";

export const localeInfo = {
  en: { name: "English", dir: "ltr" },
  ar: { name: "العربية", dir: "rtl" },
} as const satisfies Record<Locale, { name: string; dir: "ltr" | "rtl" }>;

/** Where the root page remembers a visitor's choice. */
export const localeStorageKey = "hala-site:locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** The language a content entry is written in, from its folder: `ar/home` is Arabic. */
export function localeOfEntry(id: string): Locale {
  const folder = id.split("/")[0];
  if (!isLocale(folder)) {
    throw new Error(`Content entry "${id}" is not inside a language folder (en/ or ar/).`);
  }
  return folder;
}
