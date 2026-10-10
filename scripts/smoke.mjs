// Checks a deployed copy of the site from the outside: `pnpm smoke <url>`. CI runs it against
// every deployment, preview or production, right after uploading it.
const base = process.argv[2];
if (!base) {
  console.error("Usage: pnpm smoke <deployment URL>");
  process.exit(2);
}

const checks = [
  { path: "/", status: 200, contains: "Continue in English" },
  { path: "/en/", status: 200, contains: '<html lang="en" dir="ltr"' },
  { path: "/ar/", status: 200, contains: '<html lang="ar" dir="rtl"' },
  { path: "/en", status: 308, location: "/en/" },
  { path: "/no-such-page/", status: 404, contains: "Page not found" },
];

// After a fetch, set exitCode instead of calling process.exit(): exiting while a connection is
// still closing crashes Node on Windows.

// A deployment can take a few seconds to answer after the upload finishes.
const deadline = Date.now() + 60_000;
let answered = false;
while (!answered && Date.now() < deadline) {
  answered = (await fetch(base).catch(() => null))?.status === 200;
  if (!answered) await new Promise((resolve) => setTimeout(resolve, 3_000));
}

let failed = 0;
for (const check of answered ? checks : []) {
  const response = await fetch(new URL(check.path, base), { redirect: "manual" });
  const problems = [];
  if (response.status !== check.status) problems.push(`status ${response.status}`);
  if (check.location) {
    const location = new URL(response.headers.get("location") ?? "", base).pathname;
    if (location !== check.location) problems.push(`redirects to ${location}`);
  }
  if (check.contains && !(await response.text()).includes(check.contains)) {
    problems.push(`no "${check.contains}"`);
  }
  console.log(`${problems.length ? "FAIL" : "ok  "} ${check.path} ${problems.join(", ")}`);
  if (problems.length) failed += 1;
}

if (!answered) {
  console.error(`${base} did not answer with 200 within a minute`);
  process.exitCode = 1;
} else if (failed) {
  console.error(`${failed} check(s) failed on ${base}`);
  process.exitCode = 1;
}
