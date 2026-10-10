import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/**
 * What axe finds on the current page against WCAG 2.1 A and AA (contrast, names for links and
 * fields, landmarks, heading order, language attributes), one readable line per problem; empty
 * when it finds none. Automated checks catch roughly a third of accessibility problems; keyboard
 * flow and what a screen reader announces still need a person.
 */
export async function accessibilityViolations(page: Page) {
  // Check the page as it settles, not halfway through a transition.
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }",
  });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations.map(
    (violation) =>
      `${violation.id} (${violation.help}) at ${violation.nodes
        .map((node) => node.target.join(" "))
        .join(", ")}`,
  );
}
