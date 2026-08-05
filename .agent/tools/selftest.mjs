#!/usr/bin/env node
/**
 * Verifier self-test — does each check actually fire?
 *
 * A check that silently stops catching anything is worse than no check: it
 * reports green and the regression ships. So for every rule we copy the repo
 * to a scratch directory, introduce one known defect, and assert that the
 * matching rule reports an error. A rule that stays green under its own
 * mutation is broken and fails this suite.
 *
 * This is also the guard against the tempting shortcut of "fixing" a red
 * check by loosening the check. Loosen it far enough and its mutation stops
 * being caught, and this suite goes red.
 *
 *   node .agent/tools/selftest.mjs
 */
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Each mutation names the rule that must catch it. */
const MUTATIONS = [
  {
    name: 'a renamed page leaves a dangling nav link',
    rule: 'links',
    apply: (dir) => edit(dir, 'index.html', (s) => s.replace('href="about.html"', 'href="about-old.html"')),
  },
  {
    name: 'a translation is deleted',
    rule: 'i18n',
    apply: (dir) => edit(dir, 'app.js', (s) => s.replace(/^\s*"pricing\.per":.*$/m, '')),
  },
  {
    name: 'the lead instructor is named outside about.html',
    rule: 'brand',
    apply: (dir) => edit(dir, 'index.html', (s) => s.replace('<main id="main">', '<main id="main"><p>Mary can help.</p>')),
  },
  {
    name: 'a price on the page drifts from facts.json',
    rule: 'pricing',
    apply: (dir) => edit(dir, 'pricing.html', (s) => s.replace('class="price">$160', 'class="price">$175')),
  },
  {
    name: 'a translated tier quotes another tier\'s price',
    rule: 'pricing',
    apply: (dir) =>
      edit(dir, 'app.js', (s) => s.replace(/"pricing\.t2\.btn":\s*"[^"]*"/, '"pricing.t2.btn": "Kunin ang Package ($450)"')),
  },
  {
    name: 'JSON-LD keeps a stale offer price',
    rule: 'pricing',
    apply: (dir) => edit(dir, 'index.html', (s) => s.replace('"price":"160.00"', '"price":"120.00"')),
  },
  {
    name: 'a quiz answer index points past the options',
    rule: 'quiz',
    apply: (dir) => edit(dir, 'quiz.js', (s) => s.replace(/\n(\s*)a: \d+,/, '\n$1a: 99,')),
  },
  {
    name: 'a quiz question loses its Tagalog text',
    rule: 'quiz',
    apply: (dir) => edit(dir, 'quiz.js', (s) => s.replace(/\n\s*q_tl: "[^"]*",/, '')),
  },
  {
    name: 'a copied page keeps the canonical URL it was copied from',
    rule: 'structure',
    apply: (dir) =>
      edit(dir, 'about.html', (s) =>
        s.replace(/<link rel="canonical" href="[^"]*"/, '<link rel="canonical" href="https://northlanddriving.com/"')),
  },
  {
    name: 'an image loses its alt text',
    rule: 'structure',
    apply: (dir) => edit(dir, 'about.html', (s) => s.replace(/<img([^>]*?)\salt="[^"]*"/, '<img$1')),
  },
  {
    name: 'one page is left out of a nav change',
    rule: 'nav',
    apply: (dir) => edit(dir, 'contact.html', (s) => s.replace(/<a href="quiz\.html"[^>]*>.*?<\/a>/, '')),
  },
  {
    name: 'a stale contact address survives a rename',
    rule: 'nav',
    apply: (dir) => edit(dir, 'contact.html', (s) => s.replace('hello@northlanddriving.com', 'hello@northland-driving.com')),
  },
  {
    name: 'a font is renamed in CSS but never requested',
    rule: 'assets',
    apply: (dir) => edit(dir, 'styles.css', (s) => s.replace("--f-display: 'Outfit'", "--f-display: 'Outfitt'")),
  },
  {
    name: 'one page drops the shared stylesheet',
    rule: 'assets',
    apply: (dir) => edit(dir, 'quiz.html', (s) => s.replace('<link rel="stylesheet" href="styles.css" />', '')),
  },
];

function edit(dir, file, fn) {
  const path = join(dir, file);
  const before = readFileSync(path, 'utf8');
  const after = fn(before);
  if (after === before) throw new Error(`mutation for ${file} changed nothing — the fixture moved`);
  writeFileSync(path, after);
}

function scratch() {
  const dir = mkdtempSync(join(tmpdir(), 'nd-selftest-'));
  cpSync(ROOT, dir, {
    recursive: true,
    filter: (src) => !/\/(\.git|node_modules|\.agent\/runs)(\/|$)/.test(src),
  });
  return dir;
}

function runCheck(dir) {
  try {
    const out = execFileSync(process.execPath, [join(dir, '.agent/tools/check.mjs'), '--json', '--no-write'], {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return JSON.parse(out);
  } catch (err) {
    if (err.stdout) {
      try { return JSON.parse(err.stdout); } catch { /* fall through */ }
    }
    throw new Error(`verifier did not produce JSON: ${err.stderr || err.message}`);
  }
}

const errorsFor = (report, rule) =>
  (report.results.find((r) => r.id === rule)?.findings || []).filter((f) => f.level === 'error');

let passed = 0;
const failures = [];

// 0. The unmutated repo must be clean, or every result below is meaningless.
{
  const dir = scratch();
  try {
    const report = runCheck(dir);
    if (report.ok) {
      passed++;
      console.log('  ok    baseline repo passes');
    } else {
      const errs = report.results.flatMap((r) => r.findings.filter((f) => f.level === 'error'));
      failures.push(`baseline repo is not clean (${errs.length} errors) — fix the site before trusting the self-test`);
      console.log('  FAIL  baseline repo passes');
      for (const e of errs.slice(0, 5)) console.log(`          ${e.rule}: ${e.file} — ${e.msg}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// 1. Every mutation must be caught by the rule that claims to own it.
for (const mutation of MUTATIONS) {
  const dir = scratch();
  try {
    mutation.apply(dir);
    const report = runCheck(dir);
    const caught = errorsFor(report, mutation.rule);
    if (caught.length > 0) {
      passed++;
      console.log(`  ok    ${mutation.rule.padEnd(9)} catches: ${mutation.name}`);
    } else {
      failures.push(`${mutation.rule} did NOT catch: ${mutation.name}`);
      console.log(`  FAIL  ${mutation.rule.padEnd(9)} MISSED:  ${mutation.name}`);
    }
  } catch (err) {
    failures.push(`${mutation.rule} — ${mutation.name}: ${err.message}`);
    console.log(`  ERROR ${mutation.rule.padEnd(9)} ${mutation.name}: ${err.message}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

console.log('');
const total = MUTATIONS.length + 1;
if (failures.length) {
  console.log(`SELF-TEST FAILED — ${passed}/${total} passed`);
  for (const f of failures) console.log(`  · ${f}`);
  process.exit(1);
}
console.log(`SELF-TEST PASSED — ${passed}/${total} mutations caught`);
