#!/usr/bin/env node
/**
 * Northland Driving — site verifier.
 *
 * This is the harness's ground truth. It is READ-ONLY with respect to the
 * site: it never modifies *.html, *.css or *.js. The only thing it writes
 * is a run record under .agent/runs/.
 *
 * Usage:
 *   node .agent/tools/check.mjs              # human-readable report
 *   node .agent/tools/check.mjs --json       # machine-readable
 *   node .agent/tools/check.mjs --only=i18n  # single rule
 *   node .agent/tools/check.mjs --strict     # warnings also fail
 *   node .agent/tools/check.mjs --no-write   # skip the run record
 *
 * Exit codes: 0 = pass, 1 = errors found, 2 = the verifier itself broke.
 *
 * Adding a check: drop a file in .agent/tools/checks/ exporting
 * `id`, `title` and `run(ctx)`. It is auto-discovered. See HARNESS.md.
 */
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lineOf } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const CHECKS_DIR = join(HERE, 'checks');
const RUNS_DIR = join(ROOT, '.agent', 'runs');

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};

const AS_JSON = flag('json');
const STRICT = flag('strict');
const NO_WRITE = flag('no-write');
const ONLY = opt('only');

/* ---------------------------------------------------------------- context */

const IGNORED_DIRS = new Set(['.git', 'node_modules', '.agent', '.claude']);

function walk(dir, base = '') {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      out.push(...walk(join(dir, entry.name), rel));
    } else {
      out.push(rel);
    }
  }
  return out;
}

function buildContext() {
  const files = walk(ROOT);
  const fileSet = new Set(files);
  const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

  const pages = files
    .filter((f) => extname(f) === '.html')
    .sort()
    .map((name) => ({ name, src: read(name) }));

  const scripts = files
    .filter((f) => extname(f) === '.js' && !f.includes('/'))
    .sort()
    .map((name) => ({ name, src: read(name) }));

  return { ROOT, files, fileSet, read, exists: (rel) => fileSet.has(rel), pages, scripts, lineOf };
}

/* ----------------------------------------------------------------- checks */

async function loadChecks() {
  if (!existsSync(CHECKS_DIR)) return [];
  const mods = [];
  for (const file of readdirSync(CHECKS_DIR).filter((f) => f.endsWith('.mjs')).sort()) {
    const mod = await import(pathToFileURL(join(CHECKS_DIR, file)).href);
    if (!mod.id || typeof mod.run !== 'function') {
      mods.push({ id: file, title: file, broken: `missing 'id' or 'run' export`, run: () => [] });
      continue;
    }
    mods.push({ id: mod.id, title: mod.title || mod.id, file, run: mod.run });
  }
  return mods;
}

/* ------------------------------------------------------------------ report */

const useColor = process.stdout.isTTY && !AS_JSON;
const c = {
  dim: (s) => (useColor ? `\x1b[2m${s}\x1b[0m` : s),
  red: (s) => (useColor ? `\x1b[31m${s}\x1b[0m` : s),
  yellow: (s) => (useColor ? `\x1b[33m${s}\x1b[0m` : s),
  green: (s) => (useColor ? `\x1b[32m${s}\x1b[0m` : s),
  bold: (s) => (useColor ? `\x1b[1m${s}\x1b[0m` : s),
};

function where(f) {
  if (!f.file) return '';
  return f.line ? `${f.file}:${f.line}` : f.file;
}

async function main() {
  const ctx = buildContext();
  let checks = await loadChecks();
  if (ONLY) checks = checks.filter((k) => k.id === ONLY);

  if (checks.length === 0) {
    console.error(ONLY ? `No check with id "${ONLY}".` : 'No checks found in .agent/tools/checks/.');
    process.exit(2);
  }

  const results = [];
  for (const check of checks) {
    let findings = [];
    let crashed = null;
    if (check.broken) {
      crashed = check.broken;
    } else {
      try {
        findings = (await check.run(ctx)) || [];
      } catch (err) {
        crashed = err && err.stack ? err.stack.split('\n').slice(0, 3).join(' | ') : String(err);
      }
    }
    if (crashed) {
      findings = [{ level: 'error', file: check.file ? `.agent/tools/checks/${check.file}` : check.id,
        msg: `check crashed: ${crashed}`, hint: 'Fix the check itself — a broken verifier hides real regressions.' }];
    }
    results.push({
      id: check.id,
      title: check.title,
      findings: findings.map((f) => ({ level: f.level || 'error', rule: check.id, ...f })),
    });
  }

  const all = results.flatMap((r) => r.findings);
  const errors = all.filter((f) => f.level === 'error');
  const warnings = all.filter((f) => f.level === 'warn');
  const failed = errors.length > 0 || (STRICT && warnings.length > 0);

  const record = {
    ok: !failed,
    checkedAt: new Date().toISOString(),
    counts: { checks: results.length, errors: errors.length, warnings: warnings.length },
    results,
  };

  if (AS_JSON) {
    console.log(JSON.stringify(record, null, 2));
  } else {
    for (const r of results) {
      const errs = r.findings.filter((f) => f.level === 'error').length;
      const warns = r.findings.filter((f) => f.level === 'warn').length;
      const badge = errs ? c.red('FAIL') : warns ? c.yellow('WARN') : c.green(' OK ');
      const tally = errs || warns ? c.dim(` (${errs} error${errs === 1 ? '' : 's'}, ${warns} warning${warns === 1 ? '' : 's'})`) : '';
      console.log(`${badge}  ${c.bold(r.id.padEnd(9))} ${r.title}${tally}`);
      for (const f of r.findings) {
        const mark = f.level === 'error' ? c.red('  ✗') : c.yellow('  !');
        const loc = where(f);
        console.log(`${mark} ${loc ? c.dim(loc) + ' — ' : ''}${f.msg}`);
        if (f.hint) console.log(`    ${c.dim('↳ ' + f.hint)}`);
      }
    }
    console.log('');
    const summary = `${results.length} checks · ${errors.length} errors · ${warnings.length} warnings`;
    console.log(failed ? c.red(c.bold(`FAILED — ${summary}`)) : c.green(c.bold(`PASSED — ${summary}`)));
  }

  if (!NO_WRITE) {
    try {
      mkdirSync(RUNS_DIR, { recursive: true });
      const stamp = record.checkedAt.replace(/[:.]/g, '-');
      writeFileSync(join(RUNS_DIR, `check-${stamp}.json`), JSON.stringify(record, null, 2));
      writeFileSync(join(RUNS_DIR, 'latest.json'), JSON.stringify(record, null, 2));
    } catch {
      /* run records are a convenience, never a reason to fail the check */
    }
  }

  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error('verifier crashed:', err);
  process.exit(2);
});
