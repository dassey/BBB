# Architectural Decisions Log

## Decision 5: Phrasing Shift — "Mary" to "Our Drivers"
- **Date:** 2026-08-04
- **Decision:** Remove references to "Mary" on all pages except `about.html`. Replace with "our drivers" / "our team" / "Our Drivers".
- **Rationale:** User requested expanding brand representation to a team model ("Our Drivers") across site pages, while maintaining Mary's specific profile on `about.html`.

## Decision 6: A Verifier Is the Gate for Every Change
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

## Decision 7: Checks Are Validated by Mutation, Not by Review
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
