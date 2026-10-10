import { isLocale, localeStorageKey, type Locale } from "./locales";

/**
 * Saves the visitor's language so the root page can send them straight there next time.
 * Returns false when the browser refuses storage (some private modes); the site still works,
 * the choice just isn't remembered.
 */
export function rememberLocale(
  locale: Locale,
  storage: () => Pick<Storage, "setItem"> = () => localStorage,
) {
  try {
    storage().setItem(localeStorageKey, locale);
    return true;
  } catch {
    return false;
  }
}

/** Saves the language whenever a link marked with `data-locale` is followed. */
export function rememberLocaleOnClick(root: ParentNode = document) {
  for (const link of root.querySelectorAll<HTMLAnchorElement>("a[data-locale]")) {
    link.addEventListener("click", () => {
      const { locale } = link.dataset;
      if (isLocale(locale)) rememberLocale(locale);
    });
  }
}
