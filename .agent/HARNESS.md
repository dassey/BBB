# The harness

The system around the model that decides how work on this repo gets planned,
checked, remembered and improved. Install it with [`INSTALL.md`](INSTALL.md).

The design follows Lilian Weng's *Harness Engineering for Self-Improvement*
(2026-07-04), adapted to what this repo actually is: six hand-written HTML
pages, two languages, no build step, and a business whose prices are quoted
in nine places.

---

## Why this repo needs one

The site has no framework and no tests, so nothing catches the failure mode
it actually has: **a change applied to some surfaces but not all of them.**

Every page duplicates the header and footer. Every price appears in the
markup, in the Tagalog dictionary, in JSON-LD, and in a booking form. Every
translatable string exists twice, in two files, in two languages. A careful
edit still misses one, and nothing errors — the page just quietly says the
wrong thing to a subset of visitors.

The first run of this verifier found exactly that, sitting in `main`: the
Tagalog dictionary had pricing tiers 2 and 3 swapped, so Tagalog-speaking
visitors saw the *2-hour* card labelled "3-Session Confidence Package" with
a button reading "Kunin ang Package ($450)" — the wrong product at the wrong
price, on the pricing page, in the language the site advertises as its
reason to exist. It had been live since the multi-page redesign.

That is the argument for the whole thing. The point of a harness is to make
a class of mistake impossible to ship twice.

---

## Shape

```
CLAUDE.md                    entry point — the loop, read first
.agent/
  INSTALL.md                 how to install the tools
  HARNESS.md                 this file — how the harness is built
  playbook.md                numbered rules, the ones that recur
  facts.json                 single source of truth for business facts
  memory/
    decisions.md             decisions that must survive the context window
    research_specs.md        the spec a past task worked from
    failures.md              what broke, why, and which check now owns it
  tools/
    check.mjs                the verifier — read-only, zero deps
    checks/*.mjs             one rule per file, auto-discovered
    selftest.mjs             proves each check still fires
    serve.mjs                static server
    snapshot.mjs             browser pass — runtime errors + screenshots
    lib.mjs                  shared parsing
  runs/                      run records and screenshots (gitignored)
.claude/
  settings.json              permissions, hooks
  commands/                  /verify, /harness-improve
```

Every component is a file you can read, diff and revert. Nothing important
lives only in a conversation.

---

## The loop

```
   read facts.json + playbook.md
        ↓
   plan  →  edit  →  npm run check  →  green?  →  commit
              ↑                          │
              └────────  no  ────────────┘
                          │
                     recurring?  →  add a check + a selftest mutation
                                    log it in memory/failures.md
```

`npm run check` is the gate, not a formality. It runs in well under a second
and is the difference between "I edited six files" and "the six files agree".

---

## The five ideas this is built on

**1. A fast, precise verifier is the foundation.** The article names weak and
fuzzy evaluators as the first open problem: most agent claims have nothing
that can check them. So the checks here are deliberately the *decidable*
subset — does this file exist, does this key have a translation, does this
number match that number. No check asks whether the copy is good. Everything
it does assert, it can prove, in under a second, with a line number.

**2. Durable state lives in files, not context.** `facts.json` holds the
prices. `decisions.md` holds decisions that would otherwise be re-litigated
every session — Decision 5 has already been re-applied by hand across seven
files once. `failures.md` holds what broke before. A new session starts from
the same ground as the last one, and a compacted context loses nothing.

**3. Components are separate, inspectable files.** One rule per file in
`checks/`, auto-discovered by the runner. Adding a rule is adding a file;
removing one is deleting a file. Both show up in a diff. A check that throws
is reported as a failure against itself rather than taking the suite down —
a broken verifier must be loud.

**4. The verifier is read-only and validated from outside.** `check.mjs`
never writes to the site; the only thing it writes is a run record under
`.agent/runs/`. And because a check can be "fixed" by loosening it until it
passes, `selftest.mjs` sits outside that loop: it copies the repo, breaks one
specific thing, and asserts the owning rule catches it. Loosen a check far
enough and its mutation stops being caught, and the self-test goes red. That
is the anti-reward-hacking mechanism, and it works — it caught two of the
checks in this repo silently passing when they should have failed.

**5. Improving the harness is part of the work.** When a mistake recurs, the
response is not to be more careful. It is to add the check that makes it
impossible, add the mutation that proves the check fires, and write down what
happened. The harness is expected to grow; see below.

---

## Adding a check

1. Create `.agent/tools/checks/NN-name.mjs`:

   ```js
   export const id = 'myrule';
   export const title = 'What this guarantees';

   export function run(ctx) {
     return [{ level: 'error', file: 'index.html', line: 12, msg: '…', hint: '…' }];
   }
   ```

   `ctx` gives you `pages` (`{name, src}` for each `.html`), `scripts`
   (root-level `.js`), `files`, `read(rel)`, `exists(rel)` and `lineOf`.
   Return `[]` when clean. `level` defaults to `'error'`; use `'warn'` for
   things worth seeing that should not block a commit.

2. Add a mutation to `selftest.mjs` that your rule must catch. **A check
   without a mutation is not finished** — you have no evidence it works.

3. `npm run verify`.

Number the file for run order; the number has no other meaning.

### Writing a check that earns its place

- **Anchor on a real failure.** Every rule here exists because that mistake
  is either live in the history of this repo or one edit away.
- **Prefer decidable questions.** "Does this key have a translation" is
  checkable. "Is this translation good" is not — do not pretend otherwise.
- **Say what to do.** A finding without a `hint` makes the reader re-derive
  the fix that was obvious to you when you wrote the rule.
- **Warn when a human should judge.** Errors block. Reserve them for things
  that are wrong, not things that are unusual.

---

## What is deliberately not here

**No linter or formatter.** The site is hand-written and consistent enough;
a formatter would produce a large diff and catch nothing that matters.

**No HTML validator.** Tried against the real failure list, it flags
stylistic noise and misses every bug in `failures.md`.

**No CI.** Deployment is GitHub Pages from `main`. Adding CI is a reasonable
next step; the gate is `npm run verify` either way.

**No copy or translation quality checks.** Not decidable. The i18n rules
check *coverage* and *structure* — that a key has a Tagalog string, that it
kept its inline markup, that it does not quote another tier's price. Whether
the Tagalog is natural is a human question, and the harness does not pretend
to answer it.

**No subagent orchestration.** The article covers parallel subagents and
their file-backed outputs; this repo is six pages and one verifier that runs
in under a second. If work here ever needs fanning out, `.agent/runs/` is
where those outputs should land — inspectable, not trapped in chat.
