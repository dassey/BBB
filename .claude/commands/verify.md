---
description: Run the full harness gate and report what is red
allowed-tools: Bash(npm run:*), Bash(node .agent/tools/:*), Read, Grep, Glob
---

Run the verification gate for this repo and report the result.

```bash
npm run verify
```

That is `npm run check` (the site) followed by `npm run selftest` (proof the
checks still catch their own failure cases).

Then:

- **If both pass** — say so, and summarise any warnings worth a human
  decision. Warnings do not block; do not silence one without saying why.
- **If `check` fails** — read each finding and its `hint`, fix the site, and
  re-run. Never fix a red check by loosening the check (P-16). The rules are
  in `.agent/playbook.md`; prices come from `.agent/facts.json`.
- **If `selftest` fails** — a check has stopped catching its own defect.
  That is more serious than a red site: fix the check, not the mutation.

Optionally, if `playwright` is installed, add the browser pass:

```bash
npm run runtime
```

Third-party request failures (Google Fonts) are expected offline and are
reported separately from real problems.
