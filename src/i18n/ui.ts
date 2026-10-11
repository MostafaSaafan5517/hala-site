import { site } from "../config/site";
import type { Locale } from "./locales";

interface Words {
  skipToContent: string;
  /** The wordmark link's name: the brand, then "home". */
  homeLink: (brand: string) => string;
  tryDemo: string;
  readCode: string;
  footerAbout: string;
  footerNavLabel: string;
  portfolioNote: string;
}

/** Interface words that aren't page content (links, labels), in each language. */
export const ui = {
  en: {
    skipToContent: "Skip to content",
    homeLink: (brand) => `${brand}, home`,
    tryDemo: "Try the live demo",
    readCode: "Read the code on GitHub",
    footerAbout: "An AI booking assistant for salons, clinics and studios, in Arabic and English.",
    footerNavLabel: "More about the product",
    portfolioNote: `A portfolio project by ${site.author.en}.`,
  },
  ar: {
    skipToContent: "انتقل إلى المحتوى",
    homeLink: (brand) => `${brand}، الصفحة الرئيسية`,
    tryDemo: "جرّب العرض المباشر",
    readCode: "اطّلع على الكود على GitHub",
    footerAbout:
      "مساعد ذكي لحجز المواعيد في الصالونات والعيادات والاستوديوهات، بالعربية والإنجليزية.",
    footerNavLabel: "المزيد عن المنتج",
    portfolioNote: `مشروع من معرض أعمال ${site.author.ar}.`,
  },
} as const satisfies Record<Locale, Words>;
