import { expect, test } from "@playwright/test";
import { site } from "../src/config/site";
import { localeStorageKey } from "../src/i18n/locales";
import { accessibilityViolations } from "./support/accessibility";

const pages = [
  { path: "/", lang: "en", dir: "ltr" },
  { path: "/en/", lang: "en", dir: "ltr" },
  { path: "/ar/", lang: "ar", dir: "rtl" },
  { path: "/en/features/", lang: "en", dir: "ltr" },
  { path: "/ar/features/", lang: "ar", dir: "rtl" },
  { path: "/en/how-it-works/", lang: "en", dir: "ltr" },
  { path: "/ar/how-it-works/", lang: "ar", dir: "rtl" },
  { path: "/en/pricing/", lang: "en", dir: "ltr" },
  { path: "/ar/pricing/", lang: "ar", dir: "rtl" },
  { path: "/en/faq/", lang: "en", dir: "ltr" },
  { path: "/ar/faq/", lang: "ar", dir: "rtl" },
] as const;

for (const { path, lang, dir } of pages) {
  test(`${path} declares its language and direction and passes axe`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("html")).toHaveAttribute("dir", dir);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await accessibilityViolations(page)).toEqual([]);
  });
}

test("each language's home leads to the live demo, how it works and the code", async ({ page }) => {
  for (const [path, demo, howItWorks, code] of [
    ["/en/", "Try the live demo", "See how it works", "Read the code on GitHub"],
    ["/ar/", "جرّب العرض المباشر", "شاهد كيف يعمل", "اطّلع على الكود على GitHub"],
  ] as const) {
    await page.goto(path);
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: demo }).first()).toHaveAttribute(
      "href",
      site.demoUrl,
    );
    await expect(main.getByRole("link", { name: howItWorks })).toHaveAttribute(
      "href",
      `${path}how-it-works/`,
    );
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: demo })).toHaveAttribute("href", site.demoUrl);
    await expect(footer.getByRole("link", { name: code })).toHaveAttribute("href", site.githubUrl);
  }
});

test("the root waits for a first-time visitor to choose a language", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: "Continue in English" })).toHaveAttribute(
    "href",
    "/en/",
  );
  await expect(page.getByRole("link", { name: "تابع بالعربية" })).toHaveAttribute("href", "/ar/");
});

test("the root remembers the language a visitor chose", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "تابع بالعربية" }).click();
  await expect(page).toHaveURL("/ar/");
  expect(await page.evaluate((key) => localStorage.getItem(key), localeStorageKey)).toBe("ar");

  await page.goto("/");
  await expect(page).toHaveURL("/ar/");

  // Switching language on a page updates the choice.
  await page.getByRole("banner").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en/");
  await page.goto("/");
  await expect(page).toHaveURL("/en/");
});

test("an address without the trailing slash redirects permanently to the one with it", async ({
  request,
}) => {
  for (const path of ["/en", "/ar"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(308);
    expect(new URL(response.headers()["location"] ?? "", "http://x").pathname).toBe(`${path}/`);
  }
});

test("an unknown address outside the languages gets the bilingual 404", async ({ page }) => {
  const response = await page.goto("/no-such-page/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "الصفحة غير موجودة" })).toBeVisible();
  expect(await accessibilityViolations(page)).toEqual([]);
});

for (const [locale, heading, home] of [
  ["en", "This page doesn't exist", "Home"],
  ["ar", "هذه الصفحة غير موجودة", "الرئيسية"],
] as const) {
  test(`an unknown address under /${locale}/ gets that language's 404, with the site around it`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/no-such-page/`);
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: home })).toHaveAttribute(
      "href",
      `/${locale}/`,
    );
    expect(await accessibilityViolations(page)).toEqual([]);
  });
}
