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

## Bilingual content

**P-04 [checked] · English lives in the markup; Tagalog lives in
`window.ND_DICT.tl` in `app.js`.** There is no English dictionary — `app.js`
harvests EN from the inline HTML at load. The markup is the source of truth.

**P-05 [checked] · Every `data-i18n` key needs a `tl` entry.** A missing one
does not error; it falls back to English and the page is half-translated.
`i18n` reports these.

**P-06 [checked] · A translation must keep the inline markup its English
source uses.** Dictionary values are assigned to `innerHTML`, so dropping a
`<b>` or `<span class="cost">` silently changes the layout.

**P-07 [checked] · Never let translations drift out of alignment with the
markup's ordering.** The Tagalog `pricing.t2.*` and `pricing.t3.*` blocks
were swapped for months — the keys were valid, the strings were fluent, and
the pricing page showed Tagalog visitors the wrong product at the wrong
price. `pricing` now scopes every amount to the tier whose key it sits under.

**P-08 · Edit both languages in the same commit.** A commit that touches
copy in one language only is the shape every i18n bug in this repo has had.

**P-09 · `quiz.js` uses paired fields, not the dictionary.** Questions carry
`q_en`/`q_tl`, `o_en`/`o_tl`, `e_en`/`e_tl` and a 0-based `a`. Option arrays
are indexed in parallel — if they differ in length, one language scores
wrong. `quiz` checks this.

---

## Business facts

**P-10 [checked] · `.agent/facts.json` is the source of truth for prices,
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
