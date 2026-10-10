import { describe, expect, it } from "vitest";
import { site } from "../config/site";
import { brandName, withBrand } from "./brand";

describe("withBrand", () => {
  it("fills in the product's name as each language writes it", () => {
    expect(withBrand("{brand}: bookings", "en")).toBe(`${site.name}: bookings`);
    expect(withBrand("{brand}: حجوزات", "ar")).toBe(`${site.nameAr}: حجوزات`);
    expect(brandName("ar")).toBe(site.nameAr);
  });

  it("fills in every occurrence and leaves other text alone", () => {
    expect(withBrand("{brand} and {brand}", "en")).toBe(`${site.name} and ${site.name}`);
    expect(withBrand("No name here", "en")).toBe("No name here");
  });
});
