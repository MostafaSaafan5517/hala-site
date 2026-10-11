import { getEntry, type CollectionEntry, type CollectionKey } from "astro:content";
import { withBrandDeep } from "../i18n/brand";
import { locales, type Locale } from "../i18n/locales";

/** A page in every language: `getStaticPaths` for the routes under src/pages/[lang]/. */
export function everyLanguage() {
  return locales.map((lang) => ({ params: { lang } }));
}

/**
 * A page's copy in one language, with the product's name filled in. Fails the build when the
 * language's file is missing, so the two versions of a page can't drift apart.
 */
export async function pageCopy<C extends CollectionKey>(
  collection: C,
  locale: Locale,
): Promise<CollectionEntry<C>["data"]> {
  // getEntry's result for a generic collection is a union of every collection's entries; the
  // return type narrows it back to the one asked for.
  const entry = (await getEntry(collection, locale)) as CollectionEntry<C> | undefined;
  if (!entry) {
    throw new Error(
      `src/content/${collection}/${locale}.yaml is missing: every page needs both languages.`,
    );
  }
  return withBrandDeep(entry.data, locale);
}
