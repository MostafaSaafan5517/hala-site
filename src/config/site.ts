// The product's name and the site's addresses live only here, so a rename or a new domain is a
// one-line change.
export const site = {
  name: "Hala",
  /** The name in Arabic (Hala's app mark spells it this way). */
  nameAr: "هلا",
  /** Where the site is served; canonical URLs, hreflang and sitemaps build on it. */
  url: "https://hala-site.pages.dev",
  /** The live product: its public demo and its code. */
  demoUrl: "https://hala-phi.vercel.app/demo",
  githubUrl: "https://github.com/MostafaSaafan5517/hala",
  author: { en: "Mostafa Saafan", ar: "مصطفى سعفان" },
} as const;
