import { describe, expect, it } from "vitest";
import { site } from "../config/site";
import { brandName, withBrand, withBrandDeep } from "./brand";

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

describe("withBrandDeep", () => {
  it("fills in the name in every string of a page's copy and keeps everything else", () => {
    const image = { src: "/x.jpg", width: 390 };
    const copy = {
      title: "{brand} features",
      steps: [{ heading: "Add {brand}", order: 1 }],
      nested: { note: "Plain" },
      image,
      empty: null,
    };
    expect(withBrandDeep(copy, "ar")).toEqual({
      title: `${site.nameAr} features`,
      steps: [{ heading: `Add ${site.nameAr}`, order: 1 }],
      nested: { note: "Plain" },
      image,
      empty: null,
    });
  });

  it("leaves non-plain objects (like an imported image) untouched", () => {
    const image = new (class Image {
      src = "{brand}.jpg";
    })();
    expect(withBrandDeep({ image }, "en").image).toBe(image);
  });
});
