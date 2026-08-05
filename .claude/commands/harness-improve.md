---
description: Turn a mistake that slipped through into a check that catches it
allowed-tools: Bash(npm run:*), Bash(node .agent/tools/:*), Read, Grep, Glob, Edit, Write
---

A defect got through the verifier. Close the gap.

$ARGUMENTS

Work through these in order:

**1. Name the failure precisely.** What was wrong, on which surfaces, and
what would a visitor have seen? Be specific about which language, which
page, which key. A vague description produces a vague check.

**2. Ask why nothing caught it.** Either no rule covers this class, or a
rule covers it and did not fire. The second is worse — verify by writing the
mutation first and watching the existing check stay green.

**3. Write the check.** A new file in `.agent/tools/checks/NN-name.mjs`
exporting `id`, `title` and `run(ctx)`. It is auto-discovered. Prefer the
decidable question over the ambitious one: "does this key have a Tagalog
string" is checkable, "is this Tagalog good" is not. Give every finding a
`hint` that says what to do.

**4. Write the mutation.** Add an entry to `.agent/tools/selftest.mjs` that
breaks exactly this thing and names the rule that must catch it. A check
without a mutation is not finished — you have no evidence it works.

**5. Prove it.** `npm run verify`. The new mutation must be caught, and the
other mutations must still be caught. If your check was already there and
green, you have found a broken check, not a missing one — fix it.

**6. Write it down.** An entry in `.agent/memory/failures.md`: what broke,
why nothing caught it, the fix, and which check now owns it. If the lesson
generalises, add a numbered rule to `.agent/playbook.md`.

Reference: `.agent/HARNESS.md` covers the check API and what makes a rule
worth having.
