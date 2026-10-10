import { expect, test, type Page } from "@playwright/test";
import { accessibilityViolations } from "./support/accessibility";

const preloadedFonts = (page: Page) =>
  page
    .locator('link[rel="preload"][as="font"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

test("each language preloads exactly one font file, its own script's", async ({ page }) => {
  await page.goto("/en/");
  const english = await preloadedFonts(page);
  await page.goto("/ar/");
  const arabic = await preloadedFonts(page);

  expect(english).toHaveLength(1);
  expect(arabic).toHaveLength(1);
  expect(english[0]).not.toBe(arabic[0]);
  // The root and the 404 are English pages with some Arabic: they preload the Latin file.
  await page.goto("/");
  expect(await preloadedFonts(page)).toEqual(english);
});

for (const path of ["/en/", "/ar/"]) {
  test(`${path} is set in Readex Pro, loaded from this site`, async ({ page }) => {
    const fontRequests: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "font") fontRequests.push(request.url());
    });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    const readex = await page.evaluate(() =>
      [...document.fonts]
        .filter((face) => face.family.includes("Readex Pro") && !face.family.includes("fallback"))
        .map((face) => face.status),
    );
    expect(readex).toContain("loaded");
    expect(await page.locator("h1").evaluate((h1) => getComputedStyle(h1).fontFamily)).toContain(
      "Readex Pro",
    );
    // Self-hosted: no font comes from another origin.
    expect(fontRequests.length).toBeGreaterThan(0);
    for (const url of fontRequests) expect(new URL(url).origin).toBe(new URL(page.url()).origin);
  });
}

test.describe("in dark mode", () => {
  test.use({ colorScheme: "dark" });

  for (const path of ["/", "/en/", "/ar/", "/en/no-such-page/"]) {
    test(`${path} switches to the dark tokens and passes axe`, async ({ page }) => {
      await page.goto(path);
      const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      // --hala-bg in dark mode is oklch(0.17 0.008 65).
      expect(background).toContain("0.17");
      expect(await accessibilityViolations(page)).toEqual([]);
    });
  }
});
