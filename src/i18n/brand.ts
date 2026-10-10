import { site } from "../config/site";
import type { Locale } from "./locales";

/** The product's name as each language writes it. */
export function brandName(locale: Locale): string {
  return locale === "ar" ? site.nameAr : site.name;
}

/**
 * Content keeps the name out of its text (so a rename stays a one-line change in
 * src/config/site.ts): frontmatter writes `{brand}`, and this fills it in.
 */
export function withBrand(text: string, locale: Locale): string {
  return text.replaceAll("{brand}", brandName(locale));
}
