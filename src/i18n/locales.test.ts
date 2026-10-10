import { describe, expect, it } from "vitest";
import { isLocale, localeInfo, localeOfEntry, locales } from "./locales";

describe("locales", () => {
  it("are English and Arabic, with Arabic right to left", () => {
    expect(locales).toEqual(["en", "ar"]);
    expect(localeInfo.en.dir).toBe("ltr");
    expect(localeInfo.ar.dir).toBe("rtl");
  });

  it("recognizes only the site's languages", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("EN")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("reads an entry's language from its folder", () => {
    expect(localeOfEntry("en/home")).toBe("en");
    expect(localeOfEntry("ar/blog/double-bookings")).toBe("ar");
    expect(() => localeOfEntry("home")).toThrow(/language folder/);
    expect(() => localeOfEntry("fr/home")).toThrow(/language folder/);
  });
});
