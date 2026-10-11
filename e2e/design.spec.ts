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
  // The root and the 404 show both scripts above the fold, so they preload both files.
  for (const path of ["/", "/no-such-page/"]) {
    await page.goto(path);
    expect((await preloadedFonts(page)).toSorted()).toEqual([...english, ...arabic].toSorted());
  }
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

  for (const path of ["/", "/en/", "/ar/", "/no-such-page/", "/ar/no-such-page/"]) {
    test(`${path} switches to the dark tokens and passes axe`, async ({ page }) => {
      await page.goto(path);
      const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      // --hala-bg in dark mode is oklch(0.17 0.008 65).
      expect(background).toContain("0.17");
      expect(await accessibilityViolations(page)).toEqual([]);
    });
  }
});

test("the header's language switch opens the same page in the other language", async ({ page }) => {
  await page.goto("/en/");
  const toArabic = page.getByRole("banner").getByRole("link", { name: "العربية" });
  await expect(toArabic).toHaveAttribute("lang", "ar");
  await expect(toArabic).toHaveAttribute("hreflang", "ar");
  await toArabic.click();
  await expect(page).toHaveURL("/ar/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByRole("banner").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en/");
});

test("the wordmark links home in the page's language", async ({ page }) => {
  await page.goto("/ar/");
  await expect(page.getByRole("link", { name: "هلا، الصفحة الرئيسية" })).toHaveAttribute(
    "href",
    "/ar/",
  );
  await page.goto("/en/");
  await expect(page.getByRole("link", { name: "Hala, home" })).toHaveAttribute("href", "/en/");
});

test("the skip link is the first stop for the keyboard and moves focus to the content", async ({
  page,
}) => {
  await page.goto("/en/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

for (const path of ["/en/", "/ar/"]) {
  test(`${path} fits a 320px-wide phone without sideways scrolling`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test("below 1024px the pages sit behind a menu button that opens, closes and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/");
  const button = page.getByRole("button", { name: "Menu" });
  const features = page.getByRole("banner").getByRole("link", { name: "Features" });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(features).toBeHidden();

  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(features).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(features).toBeHidden();
  await expect(button).toBeFocused();

  await button.click();
  await features.click();
  await expect(page).toHaveURL("/en/features/");
  // The new page starts with the menu closed; the current page is marked inside it.
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("banner").getByRole("link", { name: "Features" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("from 1024px the pages are in the header and there is no menu button", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/ar/");
  await expect(page.getByRole("button", { name: "القائمة" })).toBeHidden();
  for (const name of ["المزايا", "كيف يعمل", "الأسعار", "الأسئلة الشائعة"]) {
    await expect(page.getByRole("banner").getByRole("link", { name })).toBeVisible();
  }
});
