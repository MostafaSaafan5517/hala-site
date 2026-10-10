@AGENTS.md

# Hala marketing site: project guide

The marketing website for Hala, a bilingual (Arabic and English) AI booking assistant for salons, clinics and studios (live demo: https://hala-phi.vercel.app/demo, code: https://github.com/MostafaSaafan5517/hala). It sells Hala in both languages and sends visitors to the live demo.

This is a public portfolio project (Project 3, after Clubly and Hala). It proves a fast bilingual static site, technical SEO, privacy-correct analytics, a working lead form and a clean migration story. Every goal must be provable by a test or a measurement, not claimed.

The product's name lives only in `src/config/site.ts` (with the site's URL, the demo and code links, and the author). Never hard-code it elsewhere in `src/`: content writes `{brand}` in frontmatter and `<Brand />` in MDX. The docs (`README.md`, this file) use it by name.

## Stack

- Astro 7 with static output (every page pre-rendered HTML), TypeScript strict (`astro/tsconfigs/strict`), content collections with MDX
- Tailwind CSS v4 (through `@tailwindcss/vite`) on Hala's design system (see Design system below)
- Cloudflare Pages (project `hala-site`, https://hala-site.pages.dev), deployed from GitHub Actions with Wrangler; a Pages Function for the lead form in Phase 6
- Vitest (unit), Playwright with axe (end-to-end, desktop and mobile), Lighthouse CI (mobile), all in GitHub Actions
- pnpm 11; Node 24 (`engines.node` is the single source of truth). TypeScript stays on 6.0 until `typescript-eslint` and `@astrojs/check` support 7

## Non-negotiable rules

1. **Static first.** Every page is pre-rendered HTML. JavaScript only where it earns its place (consent banner, form, language memory, small interactions), as small scripts or Astro islands.
2. **Performance budgets, enforced in CI.** Lighthouse 95+ on mobile in Performance, Accessibility, Best Practices and SEO on every key page (median of 3 runs), or the build fails. Images in modern formats with explicit sizes, no layout shift, fonts that don't block rendering.
3. **Consent before tracking** (Phase 5). Consent Mode v2 defaults (all four storage types denied) are set before GTM loads; Accept, Reject and Customize have equal prominence; the choice is remembered and changeable from the footer.
4. **No secrets in the repo.** API keys live only in Cloudflare and GitHub secrets; `.env.example` lists every variable the code reads.
5. **Accessibility:** WCAG 2.1 AA, keyboard navigable, visible focus, real labels; every page passes axe in Playwright.
6. **Every claim on the site is true.** Features described must exist in Hala. No fake testimonials, invented customer logos or made-up statistics. Say "demo" and "portfolio project" where it applies.
7. **No em dashes or en dashes in any site copy** (or in docs). Use commas, colons, periods or parentheses; ranges use a hyphen or words.
8. **Small, verified steps.** Each step is verified (format, lint, types, unit, build, E2E, Lighthouse) and committed with a Conventional Commits message (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `ci:`, `chore:`). Commits are authored by Mostafa Saafan <mostafawork5517@gmail.com>, with no AI attribution.

## Languages and URLs

- Two equal languages, both prefixed: `/en/...` and `/ar/...` (`src/i18n/locales.ts`). `<html>` gets `lang` and `dir` from the page's language (`BaseLayout`).
- `/` is a bilingual page where the visitor chooses (never guessed from IP or headers). A returning visitor is sent to the language they chose last (`localStorage`, key in `localeStorageKey`): an inline script in the root's head redirects before it paints, and every link marked `data-locale` saves the choice (`src/i18n/remember.ts`).
- **Trailing slash: always.** Pages are folders (`/en/features/`); Cloudflare Pages answers the slashless form with a 308 to it. Internal links always end in `/`.
- `src/pages/404.astro` must exist: without a top-level `404.html`, Cloudflare Pages treats the site as a single-page app and answers every unknown address with the root and a 200 (the E2E test proves the 404 status).
- Arabic text inside an English page (or the reverse) carries its own `lang` (and `dir` on blocks). Interface words live in `src/i18n/ui.ts`; page copy lives in content.
- Astro 7 strips whitespace between inline elements (JSX rules, `compressHTML: 'jsx'`): write `{" "}` where a space between two elements matters.

## Content

- Collections are in `src/content.config.ts`. `pages`: one MDX file per page and language, `src/content/pages/<locale>/<page>.mdx`, with `title` and `description` (which write the product's name as `{brand}`, filled in by `withBrand`). A page route throws at build time when a language is missing, so the two versions can't drift apart.
- MDX gets `<Brand />` through `render()`'s `components`, so content never spells the name.
- Arabic copy is reviewed by Mostafa (a native speaker): flag new Arabic text in the step summary.

## Design system

The site uses Hala's design system exactly, so the marketing site and the product read as one brand. Its source is the Hala repository: `docs/design/DESIGN.md` (the rules), `docs/design/TOKENS.md` (how other projects use the tokens) and `src/styles/tokens.css` (the values).

- `src/styles/tokens.css` is a byte-for-byte copy of Hala's file: never edit it here (Prettier skips it). `pnpm tokens:check` compares it with Hala's main branch (the `Design tokens` workflow runs it weekly); `pnpm tokens:sync` copies a new version in, after which run every test and look at both languages in both modes.
- `src/styles/global.css` wires the tokens into Tailwind with the same names Hala's components use: `bg-background`, `bg-card`, `text-foreground`, `text-secondary-foreground` (ink-2), `text-muted-foreground` (ink-3), `bg-primary` / `text-primary-foreground` / `hover:bg-primary-strong` (the solid teal), `bg-accent` / `text-accent-foreground` (the SOFT teal: Tailwind's `accent` is not DESIGN.md's `accent`), `border-border`, `border-input`. Never use Tailwind's own palette (`stone-*`, `teal-*`, `white`) or raw colors.
- Type: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-large`, `text-body`, `text-small`, `text-caption` (size, line height, heading weight and tracking together). Inside `lang="ar"` the line heights grow and tracking goes, automatically; never add `tracking-*` or case transforms to Arabic.
- Shape: `rounded-control` (10px: buttons, fields), `rounded-surface` (16px: cards, panels), `rounded-panel` (20px), `rounded-badge` (6px), full pills for choices. Depth: `shadow-level-1` to `shadow-level-3`, surfaces instead of borders.
- Motion: only `transform` and `opacity`, 120/200/280 ms (`var(--hala-duration-fast)` and friends) with `ease-hala`, behind `motion-safe:`; a reduced-motion rule in `global.css` stops whatever forgets.
- Light and dark follow the device (`prefers-color-scheme`); `.hala-light` and `.hala-dark` force one. Every page passes axe in both.
- **Font:** Readex Pro for both scripts, through Astro's Fonts API (`fonts` in `astro.config.ts`): downloaded at build time and served from this site as one variable file per script (Latin, Arabic; weights 400 to 600) with `unicode-range` and a size-adjusted fallback, so nothing shifts when it arrives. `BaseLayout` preloads only the page's own script's file.

## Code conventions

- Prettier formats everything (`.astro` included; Tailwind classes sorted). ESLint (`typescript-eslint` strict, `eslint-plugin-astro`) must pass with zero warnings.
- Layouts work right to left: use logical classes (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), never `left`/`right` ones.
- Scripts in `scripts/` that fetch set `process.exitCode` instead of calling `process.exit()` after a request: exiting while a connection is still closing crashes Node on Windows (0xC0000409).
- No `console.log` in site code (scripts in `scripts/` may print), no commented-out code, no unused code, no empty `catch` blocks: say what happens instead (`return false`, a comment on why nothing else is needed).
- No abstractions for single-use code.

## Testing

- Unit tests sit next to the code as `*.test.ts` (Vitest looks only in `src/`). End-to-end specs live in `e2e/`.
- E2E and Lighthouse run against the built site served by `pnpm serve` (`wrangler pages dev` on port 8788): Cloudflare's own runtime, so redirects, headers, the 404 and Pages Functions behave as deployed. Run `pnpm build` first.
- Every page gets an axe check: `accessibilityViolations(page)` (`e2e/support/accessibility.ts`) must return `[]`.
- A test must be able to fail: when adding one, break the rule once and watch it go red.

## Commands

| Command                             | What it does                                                                                               |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                          | Astro dev server at http://localhost:4321                                                                  |
| `pnpm build`                        | Build the static site into `dist/`                                                                         |
| `pnpm serve`                        | Serve `dist/` on Cloudflare's runtime at http://localhost:8788                                             |
| `pnpm check`                        | `astro check`: types in `.astro` and `.ts` files                                                           |
| `pnpm lint`                         | ESLint; fails on any warning                                                                               |
| `pnpm format` / `pnpm format:check` | Prettier: rewrite / check only (CI checks)                                                                 |
| `pnpm test` / `pnpm test:watch`     | Vitest unit tests                                                                                          |
| `pnpm test:e2e`                     | Playwright (desktop and mobile, axe); starts `pnpm serve` itself                                           |
| `pnpm lighthouse`                   | Lighthouse CI: mobile, 3 runs per page, fails below 95 or on any layout shift; reports in `.lighthouseci/` |
| `pnpm smoke <url>`                  | Checks a deployed copy from the outside (status codes, `lang`/`dir`, redirect, 404)                        |
| `pnpm tokens:check` / `tokens:sync` | Compare the design tokens with Hala's main branch / copy Hala's current file in                            |

First Playwright run on a machine: `pnpm exec playwright install chromium`.

## CI and deployment

- `.github/workflows/ci.yml` runs on every push to any branch: **checks** (format, lint, types, unit) and **build** in parallel; then **e2e** and **lighthouse** on the built files; then **deploy**, which uploads those exact files with `wrangler pages deploy` (`main` to production at https://hala-site.pages.dev, any other branch to its preview, `<branch>.hala-site.pages.dev`) and runs `pnpm smoke` against the new deployment.
- Deploying needs the repository secret `CLOUDFLARE_API_TOKEN` (a token with only Account, Cloudflare Pages, Edit) and the variable `CLOUDFLARE_ACCOUNT_ID`.
- Cloudflare adds `X-Robots-Tag: noindex` to every preview deployment (checked 2026-10-10), so previews never compete with production in search; production has no such header.
- `wrangler.toml` describes the Pages project (`pages_build_output_dir`, compatibility date) for both `pnpm serve` and deploys.
- **Wrangler gotcha:** when Wrangler detects an AI agent and the Pages project doesn't exist, `wrangler pages project create` and `wrangler pages deploy` are silently turned into a Workers deploy (it adds the Cloudflare adapter and deploys a Worker). The project exists now, so this can't happen here again; for a new Pages project, create it once with `--force`.
