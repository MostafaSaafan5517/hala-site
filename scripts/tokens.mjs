import { readFile, writeFile } from "node:fs/promises";

// Keeps src/styles/tokens.css an exact copy of Hala's design tokens, the one source of the
// design system (https://github.com/MostafaSaafan5517/hala, docs/design/TOKENS.md).
//   pnpm tokens:check  fails when the copy differs from Hala's main branch (CI runs it weekly)
//   pnpm tokens:sync   replaces the copy with Hala's current file
const source =
  "https://raw.githubusercontent.com/MostafaSaafan5517/hala/main/src/styles/tokens.css";
const copy = new URL("../src/styles/tokens.css", import.meta.url);

const mode = process.argv[2];
if (mode !== "check" && mode !== "sync") {
  console.error("Usage: node scripts/tokens.mjs check|sync");
  process.exit(2);
}

// After a fetch, set exitCode instead of calling process.exit(): exiting while the connection is
// still closing crashes Node on Windows.
const response = await fetch(source);
const upstream = response.ok ? await response.text() : undefined;
const ours = await readFile(copy, "utf8");

if (upstream === undefined) {
  console.error(`Could not fetch Hala's tokens (${response.status} from ${source})`);
  process.exitCode = 1;
} else if (upstream === ours) {
  console.log("src/styles/tokens.css matches Hala's main branch.");
} else if (mode === "sync") {
  await writeFile(copy, upstream);
  console.log(
    "Copied Hala's tokens into src/styles/tokens.css. Run the tests and Lighthouse, and look at both languages in light and dark mode before committing.",
  );
} else {
  console.error(
    "src/styles/tokens.css differs from Hala's main branch. Run `pnpm tokens:sync`, check the site, and commit.",
  );
  process.exitCode = 1;
}
