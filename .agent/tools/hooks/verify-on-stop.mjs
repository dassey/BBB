#!/usr/bin/env node
/**
 * Stop hook: run the verifier when the agent finishes a turn, and push it
 * back to work if the site is red.
 *
 * Wired up in .claude/settings.json. Deliberately fires at turn end rather
 * than after each edit — a change that spans six pages is legitimately
 * inconsistent halfway through, and a hook that complains about that trains
 * you to ignore it.
 *
 * Loop safety: Claude Code sets `stop_hook_active` when the turn is already
 * a continuation triggered by this hook. We exit immediately in that case,
 * so the hook can interrupt at most once per chain and can never trap a turn
 * against a failure it cannot fix.
 *
 * Exit codes: 0 = let the turn end, 2 = block and hand stderr back.
 */
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const stdin = await new Promise((resolve) => {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => (data += chunk));
  process.stdin.on('end', () => resolve(data));
  setTimeout(() => resolve(data), 2000).unref?.();
});

let payload = {};
try {
  payload = JSON.parse(stdin || '{}');
} catch {
  /* no payload — treat as a first pass */
}

if (payload.stop_hook_active) process.exit(0);

let report;
try {
  const out = execFileSync(
    process.execPath,
    [join(ROOT, '.agent/tools/check.mjs'), '--json', '--no-write'],
    { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  );
  report = JSON.parse(out);
} catch (err) {
  if (err.stdout) {
    try { report = JSON.parse(err.stdout); } catch { /* fall through */ }
  }
  if (!report) process.exit(0); // verifier unavailable — never block on that
}

if (report.ok) process.exit(0);

const errors = report.results.flatMap((r) => r.findings.filter((f) => f.level === 'error'));

console.error(`npm run check is failing — ${errors.length} error${errors.length === 1 ? '' : 's'}:`);
console.error('');
for (const e of errors.slice(0, 20)) {
  const where = e.line ? `${e.file}:${e.line}` : e.file;
  console.error(`  [${e.rule}] ${where} — ${e.msg}`);
  if (e.hint) console.error(`      ${e.hint}`);
}
if (errors.length > 20) console.error(`  … and ${errors.length - 20} more`);
console.error('');
console.error('Fix these before finishing. Do not loosen a check to make it pass (P-16);');
console.error('if a rule is genuinely wrong, correct it and keep its selftest mutation green.');

process.exit(2);
