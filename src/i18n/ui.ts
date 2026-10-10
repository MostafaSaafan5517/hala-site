import { site } from "../config/site";
import type { Locale } from "./locales";

/** Interface words that aren't page content (links, labels), in each language. */
export const ui = {
  en: {
    tryDemo: "Try the live demo",
    readCode: "Read the code on GitHub",
    portfolioNote: `A portfolio project by ${site.author.en}.`,
    otherLanguage: "Read this page in Arabic",
  },
  ar: {
    tryDemo: "جرّب العرض المباشر",
    readCode: "اطّلع على الكود على GitHub",
    portfolioNote: `مشروع من معرض أعمال ${site.author.ar}.`,
    otherLanguage: "اقرأ هذه الصفحة بالإنجليزية",
  },
} as const satisfies Record<Locale, Record<string, string>>;
