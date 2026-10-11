// The site's pages in the order the header and footer list them. Each key is the page's folder
// under /en/ and /ar/; its label in each language is in src/i18n/ui.ts.
export const mainNavigation = ["features", "how-it-works", "pricing", "faq"] as const;
export type PageKey = (typeof mainNavigation)[number];
