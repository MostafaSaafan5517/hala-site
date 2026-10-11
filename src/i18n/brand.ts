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

/** withBrand for every string inside a page's copy (objects and lists included). */
export function withBrandDeep<T>(value: T, locale: Locale): T {
  if (typeof value === "string") return withBrand(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => withBrandDeep(item, locale)) as T;
  if (
    value !== null &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, withBrandDeep(item, locale)]),
    ) as T;
  }
  return value;
}
