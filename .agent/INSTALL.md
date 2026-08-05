# Installing the harness

A guide for an AI agent setting up this repo for work. Follow it top to
bottom. Every step has a command and the output that means it worked — if
you get something else, the fix is in [Troubleshooting](#troubleshooting).

The whole thing takes about a minute. **Step 1 is the only required step.**
The static verifier has no dependencies at all; everything after it is
optional depth.

---

## Step 0 — Prerequisites

```bash
node --version
```

Expected: `v18.0.0` or higher. This repo was built against `v22`.

Node is the only hard requirement. There is no build step, no framework, no
bundler — the site is hand-written HTML, CSS and JS served as static files,
and the harness is plain `.mjs` with zero dependencies.

If Node is missing, install it from your platform's package manager or
<https://nodejs.org>. Nothing else in this guide will work without it.

---

## Step 1 — The verifier (required, no install needed)

There is nothing to install. Confirm it runs:

```bash
npm run check
```

Expected output — eight checks, ending in a green summary:

```
 OK   links     Internal links and assets resolve
WARN  i18n      Tagalog covers every translatable string (0 errors, 11 warnings)
 OK   brand     Lead-instructor naming stays inside its boundary
 OK   pricing   Prices agree across pages, languages and JSON-LD
 OK   quiz      Permit quiz bank is complete and answerable
 OK   structure Page structure, accessibility and SEO basics
 OK   nav       Header, footer and contact details match across pages
WARN  assets    Stylesheets and web fonts are wired consistently (0 errors, 1 warning)

PASSED — 8 checks · 0 errors · 12 warnings
```

Warnings are expected and do not fail the run. **Errors do.** Exit code is
`0` on pass, `1` on errors, `2` if the verifier itself broke.

If `npm` is unavailable, call it directly — same thing:

```bash
node .agent/tools/check.mjs
```

### Confirm the verifier actually works

A checker that has quietly stopped checking is worse than none. This suite
copies the repo, breaks one specific thing, and asserts the matching rule
catches it:

```bash
npm run selftest
```

Expected: `SELF-TEST PASSED — 15/15 mutations caught`.

Run this whenever you change anything under `.agent/tools/`. If a mutation
is missed, the check that owns it is broken — fix the check, not the test.

---

## Step 2 — Local preview server (optional, no install needed)

```bash
npm run serve
```

Expected:

```
Northland Driving — serving /home/user/BBB
  http://localhost:8080/
  Ctrl-C to stop.
```

Use `--port=` if 8080 is taken: `node .agent/tools/serve.mjs --port=8081`.

Opening `index.html` from disk mostly works, but `file://` changes how
`localStorage` behaves, and the language toggle persists through
`localStorage`. Serve over HTTP when you need to trust what you see.

---

## Step 3 — Browser pass (optional, one install)

This drives a real Chromium against every page in both languages and
reports what static analysis cannot see: JavaScript exceptions, failed
requests, and strings that stayed English after switching to Tagalog.

```bash
npm install
```

Expected: `added 2 packages` (or `up to date`). This installs `playwright`
as a dev dependency. It does **not** download a browser — see below.

Then:

```bash
npm run runtime      # runtime errors only, fast
npm run snapshot     # the same, plus screenshots to .agent/runs/snapshots/
```

Expected: `BROWSER PASS CLEAN — 6 pages × 2 languages, no runtime errors`.

A trailing note about failed third-party requests is normal in a sandbox
with no outbound network — the site loads Google Fonts, and those failures
are reported separately and never fail the run.

### About the browser binary

Do **not** run `npx playwright install`. Many sandboxes ship Chromium
pre-installed and set `PLAYWRIGHT_BROWSERS_PATH` to point at it:

```bash
echo $PLAYWRIGHT_BROWSERS_PATH     # e.g. /opt/pw-browsers
ls $PLAYWRIGHT_BROWSERS_PATH       # chromium, chromium-1194, ...
```

If that path exists, the browser is already there and downloading another
copy wastes hundreds of megabytes. `snapshot.mjs` finds it on its own: it
tries Playwright's bundled path first, then falls back through the browsers
actually on disk. You do not need to configure anything.

If Playwright is not installed at all, `npm run snapshot` prints an
explanation and exits `0`. It is optional depth, not a gate.

---

## Step 4 — Confirm the whole harness

```bash
npm run verify
```

Runs `check` then `selftest`. This is the gate to satisfy before committing.

You are done when all of these are true:

- [ ] `npm run check` exits `0` and prints `PASSED`
- [ ] `npm run selftest` prints `15/15 mutations caught`
- [ ] `npm run serve` serves the site at `http://localhost:8080/`
- [ ] `npm run runtime` prints `BROWSER PASS CLEAN` *(optional)*

Then read [`HARNESS.md`](HARNESS.md) for how to use it, and
[`playbook.md`](playbook.md) before your first edit.

---

## Troubleshooting

**`npm run check` prints `No checks found in .agent/tools/checks/`**
You are not in the repo root, or `.agent/tools/checks/` is missing. The
verifier resolves paths relative to its own location, so `cd` to the repo
root and retry.

**A check crashes instead of reporting**
The runner catches this and reports it as an error against the check file
rather than dying, so one broken check cannot hide the other seven. Read the
message, fix the check, re-run `npm run selftest`.

**`browserType.launch: Executable doesn't exist at .../chromium_headless_shell-1234/...`**
The installed `playwright` expects a different browser build than the one on
disk. `snapshot.mjs` already handles this by falling back to whatever is
actually installed — if you see this error raw, you called Playwright
directly instead of going through `npm run snapshot`. If the fallback also
fails it prints every path it tried and exits `0`.

**`npm install` fails with a network error**
Skip it. Steps 1 and 2 have no dependencies and cover everything except
runtime behaviour. The browser pass is optional.

**`npm run runtime` reports failures against `fonts.googleapis.com`**
Expected offline. Those are third-party and reported as a note, not a
failure. If the run still fails, the problems are same-origin — read them.

**The verifier reports errors on a repo you have not touched**
Do not start by editing the check. Read the finding; the checks are anchored
to real invariants and the baseline is clean. If a check really is wrong,
fix it *and* add a mutation to `selftest.mjs` proving the corrected version
still catches its own failure case.
