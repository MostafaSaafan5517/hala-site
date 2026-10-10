# Hala marketing site

The bilingual (Arabic and English) marketing website for [Hala](https://github.com/MostafaSaafan5517/hala), an AI booking assistant for salons, clinics and studios. A portfolio project, built to be fast, accessible, findable and honest: every goal below is checked by a test or a measurement in CI.

**Live:** https://hala-site.pages.dev · **Hala's live demo:** https://hala-phi.vercel.app/demo

> Work in progress: Phase 0 (setup) is done; the goals and phases are listed below.

## Goals

1. Arabic and English as equals: full right-to-left Arabic, correct `lang` and `dir`, proper Arabic typography.
2. Lighthouse 95+ on mobile in all four categories, enforced in CI.
3. Technical SEO: hreflang, canonicals, per-page metadata, sitemaps, structured data, social images.
4. Privacy-correct analytics: GA4 through Google Tag Manager with Consent Mode v2, denied by default.
5. A working lead form into MailerLite through a Cloudflare Pages Function, with spam protection.
6. A documented 301 migration from a simulated old site, with an automated test for every old URL.
7. Ready for AI search: semantic HTML, structured data and an `llms.txt`.

## Stack

Astro 7 (static), TypeScript strict, MDX content collections, Tailwind CSS v4, Cloudflare Pages, GitHub Actions, Vitest, Playwright with axe, Lighthouse CI.

## Running it

Needs Node 24 and pnpm 11.

```bash
pnpm install
pnpm dev
```

Tests and checks:

```bash
pnpm format:check && pnpm lint && pnpm check && pnpm test
pnpm build && pnpm test:e2e && pnpm lighthouse
```

`pnpm serve` serves the built site on Cloudflare's own runtime (http://localhost:8788), which is what the end-to-end tests and Lighthouse use.

## Phases

- [x] 0. Setup: Astro, i18n routing, tests, CI, deploys to Cloudflare Pages
- [ ] 1. Hala's design system and the layout
- [ ] 2. Core pages in English and Arabic
- [ ] 3. Technical SEO
- [ ] 4. Blog
- [ ] 5. Consent, GTM and GA4
- [ ] 6. Lead form
- [ ] 7. Migration example
- [ ] 8. Polish, docs and results
