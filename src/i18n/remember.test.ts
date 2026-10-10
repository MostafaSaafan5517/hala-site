import { describe, expect, it } from "vitest";
import { localeStorageKey } from "./locales";
import { rememberLocale } from "./remember";

describe("rememberLocale", () => {
  it("saves the language under the key the root page reads", () => {
    const saved = new Map<string, string>();
    const storage = { setItem: (key: string, value: string) => void saved.set(key, value) };
    expect(rememberLocale("ar", () => storage)).toBe(true);
    expect(saved.get(localeStorageKey)).toBe("ar");
  });

  it("reports false instead of failing when the browser refuses storage", () => {
    const blocked = () => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    };
    expect(rememberLocale("en", blocked)).toBe(false);
  });
});
