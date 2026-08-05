# Architectural Decisions Log

## Decision 5: Phrasing Shift — "Mary" to "Our Drivers"
- **Date:** 2026-08-04
- **Decision:** Remove references to "Mary" on all pages except `about.html`. Replace with "our drivers" / "our team" / "Our Drivers".
- **Rationale:** User requested expanding brand representation to a team model ("Our Drivers") across site pages, while maintaining Mary's specific profile on `about.html`.
- **Note (2026-08-05):** This entry was overwritten in `c1f2a07` and restored
  when that commit merged with the harness branch. It is load-bearing:
  `.agent/facts.json` and the `brand` check both cite "Decision 5" by number.

## Decision 6: Hero Banner Layout Overhaul
- **Date:** 2026-08-04
- **Decision:** Replace side-by-side hero split with a wide, full-width hero banner layout on `index.html`.
- **Rationale:** Addresses user feedback directly. Full-width banners create a more professional, traditional, and striking first impression for modern service websites.

## Decision 7: A Verifier Is the Gate for Every Change
- **Date:** 2026-08-05
- **Decision:** `.agent/tools/check.mjs` gates changes to this repo. Run
  `npm run check` before and after every edit; a red run blocks the commit.
  The rules it enforces are documented in `.agent/playbook.md`.
- **Rationale:** The site duplicates its header, footer, prices and every
  translatable string across six hand-edited pages and two languages. The
  recurring defect is a change applied to some surfaces but not all, and it
  never throws — the page just says the wrong thing. The verifier's first run
  found live evidence of exactly this (see F-002 in `memory/failures.md`).
- **Consequence:** Business facts move to `.agent/facts.json` as the single
  source of truth. Change a price there first, then propagate; the check
  fails until every page, both languages and the JSON-LD agree.

## Decision 8: Checks Are Validated by Mutation, Not by Review
- **Date:** 2026-08-05
- **Decision:** Every check in `.agent/tools/checks/` ships with a mutation in
  `.agent/tools/selftest.mjs` that it must catch. A check without one is not
  finished. Never fix a failing check by loosening it — if a rule is wrong,
  correct it and keep its mutation passing.
- **Rationale:** Two checks were written, read correctly on review, and
  caught nothing (F-001). The self-test found both immediately. It also
  removes the shortcut of quietly weakening a rule until it goes green: a
  rule loose enough to miss its own failure case fails the self-test.
- **Consequence:** `npm run verify` runs both. The self-test is deliberately
  outside the loop it validates.

## Decision 9: Append to This Log, Never Overwrite It
- **Date:** 2026-08-05
- **Decision:** New entries are appended with the next unused number. Never
  reuse a number and never replace an existing entry — this file is the
  record a future session starts from, and other files cite its entries by
  number.
- **Rationale:** `c1f2a07` replaced Decision 5 with Decision 6 in a single
  edit, deleting the brand rule that `facts.json` and the `brand` check both
  point at. The decision survived only because it was also encoded in a
  check. Nothing would have caught the loss of the prose.

## Decision 10: The Site Ships English-Only While the Design Settles
- **Date:** 2026-08-05
- **Decision:** Remove the EN/TL toggle, the `window.ND_DICT.tl` dictionary,
  the `data-i18n` hooks on all six pages, and the paired `_en`/`_tl` fields
  in `quiz.js`. The `i18n` check and playbook rules P-04–P-09 retire with
  them. **Temporary — until the site's design is settled.**
- **Rationale:** Owner call. Every copy change cost two edits in two files
  and the dictionary was already drifting (ten orphaned keys and a dropped
  inline tag at the time of removal). With the design in flux that tax is
  paid on work that is about to be thrown away.
- **Kept deliberately:** the *claim* that lessons are taught in Tagalog —
  meta descriptions, JSON-LD, the `EN · TL` stat, the `about.v3` card. The
  drivers speak Tagalog; that is a business differentiator and it is
  independent of whether the website translates itself.
- **Consequence:** `facts.business.languages` and
  `brand.leadInstructorKeyPrefixAllowed` are gone from `facts.json`. The
  `pricing`, `brand` and `structure` checks lost their dictionary-scoped
  sections rather than keeping them as blocks that silently never fire
  (P-16). `quiz` now requires `q`, `o`, `a`, `e`.
- **To restore:** `git revert` the removal commit on the `remove-i18n`
  branch, or `git show <commit>^:app.js` for the dictionary alone. The
  Tagalog strings are not lost, only unshipped.
