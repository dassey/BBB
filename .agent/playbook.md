# Playbook

Numbered rules for working in this repo. Each one exists because ignoring it
produced a real defect. IDs are stable — cite them in commit messages and in
`memory/failures.md`.

Add a rule when a mistake recurs. If a rule can be enforced by a check,
write the check and mark the rule `[checked]`; the rest depend on judgment.

---

## Structure

**P-01 [checked] · There is no layout include — the header and footer are
copy-pasted into all six pages.** Any change to the nav, brand, language
toggle or footer means editing every `.html` file. `nav` catches a page left
behind.

**P-02 [checked] · A new page is not done until it is linked.** Add it to the
nav on all six pages, give it a canonical URL matching its filename, and load
`app.js` and `styles.css`. `structure` and `nav` check all four.

**P-03 · Copy the nearest existing page when adding one.** Then fix the
`<title>`, meta description, canonical, `og:` tags and `<h1>`. The canonical
is the one that is silently wrong most often — `structure` checks it because
copying is the normal workflow here.

---

## Bilingual content — retired

**P-04 through P-09 are retired (Decision 10, 2026-08-05).** The site shipped
an EN/TL toggle backed by a Tagalog dictionary in `app.js` and paired
`_en`/`_tl` fields in `quiz.js`. All of it was removed while the site's
design is in flux. The `i18n` check is gone with it.

These IDs stay burned — do not reuse the numbers. `memory/failures.md` still
cites them, and the rules become live again the moment translation returns.
The history is in git; see Decision 10 for how to get it back.

**P-09a · `quiz.js` questions carry `q`, `o`, `a`, `e`.** `a` is a 0-based
index into `o`. If it points past the end, every attempt scores wrong and
nothing throws. `quiz` checks this.

---

## Business facts

**P-10 [checked] · `data/facts.json` is the source of truth for prices,
contact details and service area.** Change it first, then propagate. The
verifier fails until every surface agrees.

**P-11 [checked] · A price change touches more places than you think.** The
markup, the Tagalog dictionary, the JSON-LD `makesOffer` *and* `priceRange`,
the contact form's option labels, the meta descriptions, and any derived
claim ("$75/hour value", "save $60"). `pricing` recomputes the derived ones.

**P-12 [checked] · Third-party amounts belong in `facts.external.fees`.**
Missouri's permit fees are quoted on `permit.html`. Anything in `fees` is an
amount pages may print; everything else in `external` is not money.

---

## Brand

**P-13 [checked] · The lead instructor is named only on `about.html` and
under `about.*` dictionary keys.** Everywhere else uses the team voice —
"our drivers", "our team", "our female drivers". This is Decision 5 and it
has already been re-applied by hand across seven files once.

**P-14 · The audience wording is "adult women".** Set in
`facts.business.audience`. It is a positioning choice, not a placeholder.

---

## Working method

**P-15 · Run `npm run check` before and after.** Before, so you know what
was already broken; after, so you know what you broke.

**P-16 · Never fix a red check by loosening the check.** If a rule is
genuinely wrong, correct it *and* keep its `selftest.mjs` mutation passing.
A rule that no longer catches its own failure case is not a rule.

**P-17 [checked] · A new check ships with a mutation that proves it fires.**
Two checks in this repo were written, looked correct, and caught nothing.
`selftest.mjs` found both.

**P-18 · Warnings are triage, not noise.** They mark things a human should
decide — dead dictionary keys, a render-blocking `@import`. Do not silence
one without saying why in the commit message.

**P-19 · Write down anything a future session would otherwise re-derive.**
Decisions go in `memory/decisions.md`, defects and their fix in
`memory/failures.md`, recurring rules here.
