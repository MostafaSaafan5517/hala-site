import { describe, expect, it } from "vitest";
import { pathInLocale } from "./paths";

describe("pathInLocale", () => {
  it("swaps the language prefix and keeps the rest of the path", () => {
    expect(pathInLocale("/en/", "ar")).toBe("/ar/");
    expect(pathInLocale("/ar/features/", "en")).toBe("/en/features/");
    expect(pathInLocale("/en/blog/double-bookings/", "ar")).toBe("/ar/blog/double-bookings/");
    expect(pathInLocale("/ar/", "ar")).toBe("/ar/");
  });

  it("refuses paths outside a language folder", () => {
    expect(() => pathInLocale("/", "en")).toThrow(/language folder/);
    expect(() => pathInLocale("/fr/features/", "en")).toThrow(/language folder/);
    expect(() => pathInLocale("en/", "ar")).toThrow(/language folder/);
  });
});
