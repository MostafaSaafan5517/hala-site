import type { PageKey } from "../config/navigation";
import { site } from "../config/site";
import type { Locale } from "./locales";

interface Words {
  skipToContent: string;
  /** Each page's name in menus. */
  pages: Record<PageKey, string>;
  mainNavLabel: string;
  menu: string;
  /** The wordmark link's name: the brand, then "home". */
  homeLink: (brand: string) => string;
  tryDemo: string;
  readCode: string;
  footerAbout: string;
  footerNavLabel: string;
  footerPagesLabel: string;
  portfolioNote: string;
  notFound: { title: string; heading: string; text: string; home: string };
}

/** Interface words that aren't page content (links, labels), in each language. */
export const ui = {
  en: {
    skipToContent: "Skip to content",
    pages: {
      features: "Features",
      "how-it-works": "How it works",
      pricing: "Pricing",
      faq: "FAQ",
    },
    mainNavLabel: "Main",
    menu: "Menu",
    homeLink: (brand) => `${brand}, home`,
    tryDemo: "Try the live demo",
    readCode: "Read the code on GitHub",
    footerAbout: "An AI booking assistant for salons, clinics and studios, in Arabic and English.",
    footerNavLabel: "More about the product",
    footerPagesLabel: "Pages",
    portfolioNote: `A portfolio project by ${site.author.en}.`,
    notFound: {
      title: "Page not found",
      heading: "This page doesn't exist",
      text: "The address may be mistyped, or the page may have moved. These pages do exist:",
      home: "Home",
    },
  },
  ar: {
    skipToContent: "انتقل إلى المحتوى",
    pages: {
      features: "المزايا",
      "how-it-works": "كيف يعمل",
      pricing: "الأسعار",
      faq: "الأسئلة الشائعة",
    },
    mainNavLabel: "الرئيسية",
    menu: "القائمة",
    homeLink: (brand) => `${brand}، الصفحة الرئيسية`,
    tryDemo: "جرّب العرض المباشر",
    readCode: "اطّلع على الكود على GitHub",
    footerAbout:
      "مساعد ذكي لحجز المواعيد في الصالونات والعيادات والاستوديوهات، بالعربية والإنجليزية.",
    footerNavLabel: "المزيد عن المنتج",
    footerPagesLabel: "الصفحات",
    portfolioNote: `مشروع من معرض أعمال ${site.author.ar}.`,
    notFound: {
      title: "الصفحة غير موجودة",
      heading: "هذه الصفحة غير موجودة",
      text: "ربما كُتب العنوان بشكل خاطئ، أو نُقلت الصفحة. وهذه الصفحات موجودة:",
      home: "الرئيسية",
    },
  },
} as const satisfies Record<Locale, Words>;
