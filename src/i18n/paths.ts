import { isLocale, type Locale } from "./locales";

/**
 * The same page in another language: `/en/features/` becomes `/ar/features/`. Every page lives
 * under a language prefix, so anything else is a mistake in the caller.
 */
export function pathInLocale(pathname: string, locale: Locale): string {
  const [empty, current, ...rest] = pathname.split("/");
  if (empty !== "" || !isLocale(current)) {
    throw new Error(`"${pathname}" is not inside a language folder (/en/ or /ar/).`);
  }
  return ["", locale, ...rest].join("/");
}
