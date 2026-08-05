# Northland Driving

Static marketing site for a driving school in Gladstone, MO — patient
one-on-one lessons for adult women, taught in English or Tagalog. Six
hand-written HTML pages, no build step, deployed to GitHub Pages from `main`.

The *site* is English-only. Tagalog is something the drivers speak, and the
copy says so; there is no longer a translation layer (Decision 10).

## Before you edit

```bash
npm run check
```

Under a second, no dependencies. Run it before you start so you know what was
already broken, and after you finish so you know what you broke. A red run
blocks the commit.

Then read **[`.agent/playbook.md`](.agent/playbook.md)** — numbered rules,
each one there because ignoring it produced a real defect. The ones that bite
first:

- **The header, footer and nav are copy-pasted into all six pages.** There is
  no include. Changing one means changing six (P-01).
- **Prices come from [`.agent/facts.json`](.agent/facts.json).** Change it
  first, then propagate to the markup, the JSON-LD and the contact form
  (P-10, P-11).
- **The lead instructor is named only on `about.html`.** Everywhere else uses
  the team voice — "our drivers" (P-13, Decision 5).

## Files

| File | What it is |
|------|-----------|
| `index.html` | Home |
| `about.html` | Our Drivers — lead instructor & team |
| `pricing.html` | Pricing & session packages |
| `permit.html` | Missouri permit guide |
| `quiz.html` · `quiz.js` | Missouri permit practice quiz (30 questions) |
| `contact.html` | Booking, via a `mailto:` handoff |
| `styles.css` | Shared design system |
| `app.js` | Nav, sticky header, FAQ, booking |

## Commands

| Command | What it does |
|---------|--------------|
| `npm run check` | Verify the site. **The gate.** |
| `npm run selftest` | Prove the checks still catch their own failure cases |
| `npm run verify` | Both of the above — run before committing |
| `npm run serve` | Static server on :8080 |
| `npm run runtime` | Real browser, runtime errors *(optional)* |
| `npm run snapshot` | The same, plus screenshots to `.agent/runs/` |

Setup, including the optional browser pass, is in
[`.agent/INSTALL.md`](.agent/INSTALL.md). The only hard requirement is Node 18+.

## When the checker is right and you are wrong

It usually is — the baseline is clean and every rule is anchored to a defect
that actually happened. Read the finding and the `hint` before doubting it.

**Never fix a red check by loosening the check** (P-16). If a rule really is
wrong, correct it *and* keep its mutation in `.agent/tools/selftest.mjs`
passing. A rule that no longer catches its own failure case is not a rule.

If you hit a mistake that no check would have caught, that is the signal to
add one: a file in `.agent/tools/checks/`, a mutation in `selftest.mjs`, an
entry in [`.agent/memory/failures.md`](.agent/memory/failures.md). How to
write one is in [`.agent/HARNESS.md`](.agent/HARNESS.md).

## Memory

Durable state lives in files so a new session starts where the last one
finished:

- [`.agent/memory/decisions.md`](.agent/memory/decisions.md) — decisions that
  must survive the context window
- [`.agent/memory/failures.md`](.agent/memory/failures.md) — what broke, and
  which check owns it now
- [`.agent/memory/research_specs.md`](.agent/memory/research_specs.md) — the
  spec a past task worked from

Write to them when you learn something a future session would otherwise
re-derive (P-19).
