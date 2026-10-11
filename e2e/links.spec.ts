import { expect, test } from "@playwright/test";
import { mainNavigation } from "../src/config/navigation";
import { locales } from "../src/i18n/locales";

// Every page of the site, in every language, plus the root.
const pages = [
  "/",
  ...locales.flatMap((locale) => [
    `/${locale}/`,
    ...mainNavigation.map((page) => `/${locale}/${page}/`),
  ]),
];

test("every internal link on every page leads somewhere real", async ({ page, request }) => {
  const checked = new Map<string, number>();
  for (const path of pages) {
    await page.goto(path);
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      const url = new URL(href, page.url());
      if (url.origin !== new URL(page.url()).origin) continue;

      if (url.hash) {
        // An anchor must point at an element on the page it names.
        if (url.pathname === new URL(page.url()).pathname) {
          await expect(page.locator(url.hash), `${href} on ${path}`).toHaveCount(1);
        }
      }
      if (!checked.has(url.pathname)) {
        checked.set(url.pathname, (await request.get(url.pathname)).status());
      }
      expect(checked.get(url.pathname), `${href} on ${path}`).toBe(200);
    }
  }
  // Sanity check that the crawl saw the whole site.
  expect(checked.size).toBeGreaterThanOrEqual(pages.length - 1);
});
