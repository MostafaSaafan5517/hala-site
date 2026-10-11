import { expect, test } from "@playwright/test";
import { mainNavigation } from "../src/config/navigation";
import { locales } from "../src/i18n/locales";

// Every page of the site, in every language, plus the root.
const pages = [
  "/",
  ...locales.flatMap((locale) => [
    `/${locale}/`,
    ...mainNavigation.map((page) => `/${locale}/${page}/`),
    // The 404 itself answers 404, but every link on it must work.
    `/${locale}/no-such-page/`,
  ]),
  "/no-such-page/",
];

test("every internal link on every page answers 200 directly, with no redirect", async ({
  page,
  request,
}) => {
  const checked = new Map<string, number>();
  for (const path of pages) {
    await page.goto(path);
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      const url = new URL(href, page.url());
      if (url.origin !== new URL(page.url()).origin) continue;

      // A link within this page (the skip link, the contents list) must name an element on it.
      if (url.pathname === new URL(page.url()).pathname) {
        if (url.hash) await expect(page.locator(url.hash), `${href} on ${path}`).toHaveCount(1);
        continue;
      }
      // No redirects either: every internal link is already the final address, slash included.
      if (!checked.has(url.pathname)) {
        checked.set(url.pathname, (await request.get(url.pathname, { maxRedirects: 0 })).status());
      }
      expect(checked.get(url.pathname), `${href} on ${path}`).toBe(200);
    }
  }
  // Sanity check that the crawl reached every page in every language (nothing links to the root,
  // which is only an entry point).
  expect(checked.size).toBeGreaterThanOrEqual(locales.length * (1 + mainNavigation.length));
});
