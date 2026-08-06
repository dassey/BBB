# Failure log

What broke, how it was found, and which check now owns it. The point is that
each entry is a class of mistake, not a one-off — an entry without a check
is an invitation for the same bug to come back.

Newest first.

---

## F-004 · Every og:image was a relative path

- **Found:** 2026-08-05, by eye, after the owner produced a new `og.jpg`.
- **Live since:** the multi-page redesign — all six pages.
- **What happened:** every page carried
  `<meta property="og:image" content="images/og.jpg" />`. Facebook, Slack and
  iMessage do not resolve relative paths; they need an absolute URL. So the
  link preview rendered with no image at all, on every page, forever.
- **Why nothing caught it:** the failure is entirely off-site. The file
  existed, the path resolved in a browser, `links` was happy, no page looked
  wrong. The only symptom lives inside someone else's scraper.
- **Fix:** absolute URLs plus `og:image:width`/`height`/`alt` and
  `twitter:card`, so scrapers can lay the card out before the image lands.
- **Owned by:** `structure`, which now requires `og:image` to be absolute and
  on the site's own domain. Mutation: *og:image goes back to a relative path*.

---

## F-003 · A check anchored to markup that was deleted underneath it

- **Found:** 2026-08-05, by `npm run selftest` (not by review).
- **What happened:** `pricing` scoped each price tag to its tier by finding
  the nearest preceding `data-i18n="pricing.tN."`. Decision 10 removed every
  `data-i18n` attribute, so the anchor matched nothing, `tier` was always
  null, and the loop `continue`d on every iteration. The rule did not fail —
  it stopped existing, silently, while still printing `OK`.
- **Why nothing caught it:** a check reporting no findings is
  indistinguishable from a clean repo. Only the mutation test could tell the
  difference, and it did so immediately.
- **Fix:** re-anchored to the `.t-name` card, which is real content rather
  than a translation hook.
- **Lesson:** this is the argument for P-17 in its strongest form. A rule
  whose selector is coupled to markup that another task may delete will
  degrade to a no-op, not to a failure. Anchor rules to content, not
  scaffolding.

---

## F-002 · Tagalog pricing tiers swapped against the markup

- **Found:** 2026-08-05, by the first run of `check.mjs` (`pricing`).
- **Live since:** the multi-page redesign (`fba3a60`).
- **Severity:** commercial. Wrong product shown at wrong price, in the
  language the site advertises as its reason to exist.

**What was wrong.** `pricing.html` lays out three cards in DOM order: t1
($85, 1 hour), t2 ($160, 2 hours), t3 ($450, 6-hour package). The Tagalog
dictionary had t2 and t3 transposed. So with Tagalog selected, the middle
card showed the `$160` price from the markup under the name "3-Session
Confidence Package", with a button reading "Kunin ang Package ($450)" — and
the third card showed `$450` under "2-Oras na Session" with a button reading
"Mag-book ng 2-oras ($160)".

Both languages were individually fluent, every key existed, and nothing
threw. English readers saw a correct page, which is why it survived review.

**Why nothing caught it.** There was nothing to catch it. No test, no
verifier, and the two halves of each string live in different files — the
English in `pricing.html`, the Tagalog in `app.js` — 60 lines apart.

**Fix.** Rewrote the Tagalog `pricing.t2.*` and `pricing.t3.*` blocks as
faithful translations of their English sources. The t2/t3 feature lists had
drifted too — neither mentioned the free Northland pick-up that both English
cards list — so a straight swap would not have been enough.

**Check that owns it:** `pricing`. Every dollar amount inside a
`pricing.tN.*` translation must be an amount belonging to tier N — its
price, its per-hour rate, or its saving against the base hourly rate — and a
tier's translated name may not be another tier's product name.
Mutations: *"a translated tier quotes another tier's price"*.

**Playbook:** P-07, P-11.

---

## F-001 · Two checks that caught nothing

- **Found:** 2026-08-05, by `selftest.mjs`, minutes after the checks were
  written.
- **Severity:** structural. Both reported green on a repo where their own
  failure case was present.

**What was wrong.** Two rules in `80-assets.mjs`:

1. *Font used but never requested* scanned `font-family:` declarations. This
   site sets `font-family: var(--f-display)` and defines the real stacks in
   custom properties, so the scan only ever saw `var()` calls. Compounding
   it, the anchor `(?:^|[;{])` could not reach a declaration preceded by a
   CSS comment — and `--f-display` sits directly under
   `/* Typography Families */`.
2. *Page loads a different stylesheet set* was a warning, so a page missing
   `styles.css` entirely — which renders unstyled — did not fail anything.

**Fix.** Treat any declaration whose value ends in a generic family as a
font stack, whatever the property name; blank CSS comments before scanning
(preserving offsets so line numbers stay right). Split the stylesheet rule:
missing a sheet the other pages load is an error, carrying an extra one is a
warning.

**Lesson.** Both checks read correctly. Reviewing them would not have found
this — only running them against a known defect did.

**Playbook:** P-16, P-17.

---

## Open observations

Things the harness surfaces that need a human decision, not a fix.

*The three earlier observations are resolved (2026-08-05). The duplicate font
`@import` is gone — one `<link>` now loads exactly the families the CSS names.
Both dictionary observations died with the translation layer (Decision 10).*

- **`images/instructor.jpg` is landscape in a portrait frame.** The photo is
  1500×1200; `.portrait` is `aspect-ratio: 4/5`, so `object-fit: cover` shows
  roughly the middle 64% of its width. Worked around with
  `object-position: 62%` so the instructor sits in frame rather than against
  the right edge. A portrait re-shoot would let that override go. Not
  machine-checkable — whether a crop looks right is a human call.
- **`images/instructor.jpg` is 467 KB against a 220 KB target.** Re-export at
  JPEG quality 78–82. Nothing enforces image weight; a size budget in
  `assets` is a reasonable future check.
