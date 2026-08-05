# Failure log

What broke, how it was found, and which check now owns it. The point is that
each entry is a class of mistake, not a one-off — an entry without a check
is an invitation for the same bug to come back.

Newest first.

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

- **`styles.css:7` `@import`s a second Google Fonts stylesheet.** Every page
  already `<link>`s Overpass/Overpass Mono/Inter; the CSS then imports
  Outfit/JetBrains Mono/variable Inter and prefers those, using the linked
  pair only as fallback. Both sets download on every page load, and the
  `@import` cannot start until `styles.css` has arrived. Consolidating means
  deciding which family the brand actually uses — a design call.
  Reported by `assets`.
- **10 dictionary keys are translated but unused** (`cta.*`, `common.badge.*`,
  `foot.emailcta`, `about.phcaption`, `contact.reach.h`). Leftovers from the
  redesign. Deleting them is safe; keeping them is harmless but misleads the
  next edit into thinking that markup still exists. Reported by `i18n`.
- **`permit.st4.p` drops inline markup.** English wraps the fee in
  `<span class="cost">$10.00</span>`; the Tagalog writes it plain, so the
  styled cost pill disappears in Tagalog. One-line fix, but it is a copy
  decision. Reported by `i18n`.
