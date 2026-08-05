#!/usr/bin/env node
/**
 * Browser pass: load every page in a real browser, in both languages, and
 * report anything the static checker cannot see — JavaScript exceptions,
 * failed asset requests, and strings that stayed English after switching
 * to Tagalog. Optionally writes screenshots.
 *
 *   node .agent/tools/snapshot.mjs              # runtime errors + screenshots
 *   node .agent/tools/snapshot.mjs --no-shots   # runtime errors only (fast)
 *   node .agent/tools/snapshot.mjs --page=quiz.html
 *
 * Requires the optional `playwright` package. Without it this exits 0 with
 * an explanation rather than failing — the static checker is the gate, this
 * is the deeper look. See .agent/INSTALL.md.
 *
 * Exit codes: 0 = clean (or skipped), 1 = runtime problems found.
 */
import { readdirSync, mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from './serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, '.agent', 'runs', 'snapshots');

const argv = process.argv.slice(2);
const has = (f) => argv.includes(`--${f}`);
const val = (f) => {
  const hit = argv.find((a) => a.startsWith(`--${f}=`));
  return hit ? hit.slice(f.length + 3) : null;
};

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('playwright is not installed — skipping the browser pass.');
  console.log('');
  console.log('  npm install            # installs it as a dev dependency');
  console.log('');
  console.log('Chromium itself is already present, so no browser download is needed.');
  console.log('The static checker (npm run check) covers everything except runtime behaviour.');
  process.exit(0);
}

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const only = val('page');
const pages = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => !only || f === only)
  .sort();

if (pages.length === 0) {
  console.error(only ? `No page named ${only}.` : 'No pages found.');
  process.exit(1);
}

/**
 * Launch Chromium, tolerating a preinstalled browser whose build number does
 * not match the installed playwright package. Sandboxed CI images ship a
 * browser at a fixed path; playwright only looks for the exact revision it
 * was built against, so fall back to whatever is actually on disk rather
 * than downloading a second copy.
 */
async function launchChromium() {
  const attempts = [null, ...browserCandidates()];
  const errors = [];
  for (const executablePath of attempts) {
    try {
      return await chromium.launch(executablePath ? { executablePath } : {});
    } catch (err) {
      errors.push(`${executablePath ?? 'bundled'}: ${String(err.message).split('\n')[0]}`);
    }
  }
  console.log('Could not start Chromium. Tried:');
  for (const e of errors) console.log(`  · ${e}`);
  console.log('\nSee .agent/INSTALL.md — the static checker (npm run check) does not need a browser.');
  process.exit(0);
}

function browserCandidates() {
  const out = [];
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (base && existsSync(base)) {
    const direct = join(base, 'chromium');
    if (existsSync(direct) && statSync(direct).isFile()) out.push(direct);
    for (const entry of readdirSync(base).sort().reverse()) {
      for (const suffix of ['chrome-linux/chrome', 'chrome-linux/headless_shell', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const candidate = join(base, entry, suffix);
        if (existsSync(candidate)) out.push(candidate);
      }
    }
  }
  for (const sys of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) {
    if (existsSync(sys)) out.push(sys);
  }
  return out;
}

const { server, port } = await startServer(0);
const browser = await launchChromium();
const problems = [];
const shots = [];

try {
  for (const page of pages) {
    for (const lang of ['en', 'tl']) {
      const context = await browser.newContext({ viewport: VIEWPORTS[0] });
      const tab = await context.newPage();

      tab.on('pageerror', (err) => {
        problems.push({ page, lang, kind: 'exception', detail: err.message });
      });
      tab.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        const from = msg.location()?.url || '';
        const external = from && !from.startsWith(`http://localhost:${port}/`);
        problems.push({ page, lang, kind: external ? 'external' : 'console', detail: msg.text() });
      });
      // Third-party origins (web fonts, analytics) fail in offline sandboxes
      // for reasons that have nothing to do with this site. Record them, but
      // only our own assets decide pass/fail.
      const isOurs = (url) => url.startsWith(`http://localhost:${port}/`);

      tab.on('requestfailed', (req) => {
        const detail = `${req.url()} — ${req.failure()?.errorText ?? 'failed'}`;
        problems.push({ page, lang, kind: isOurs(req.url()) ? 'request' : 'external', detail });
      });
      tab.on('response', (res) => {
        if (res.status() >= 400) {
          problems.push({ page, lang, kind: isOurs(res.url()) ? 'http' : 'external', detail: `${res.status()} ${res.url()}` });
        }
      });

      await tab.goto(`http://localhost:${port}/${page}`, { waitUntil: 'networkidle', timeout: 20000 });

      if (lang === 'tl') {
        const button = tab.locator('.lang button[data-lang="tl"]');
        if ((await button.count()) === 0) {
          problems.push({ page, lang, kind: 'i18n', detail: 'no Tagalog toggle button on this page' });
        } else {
          await button.first().click();
          await tab.waitForTimeout(250);
          const htmlLang = await tab.evaluate(() => document.documentElement.lang);
          if (htmlLang !== 'tl') {
            problems.push({ page, lang, kind: 'i18n', detail: `<html lang> stayed "${htmlLang}" after switching to Tagalog` });
          }
          const untranslated = await tab.evaluate(() => {
            const dict = (window.ND_DICT && window.ND_DICT.tl) || {};
            return [...document.querySelectorAll('[data-i18n]')]
              .map((el) => el.getAttribute('data-i18n'))
              .filter((k) => !(k in dict));
          });
          for (const key of untranslated) {
            problems.push({ page, lang, kind: 'i18n', detail: `"${key}" rendered in English` });
          }
        }
      }

      if (!has('no-shots')) {
        mkdirSync(OUT, { recursive: true });
        for (const vp of VIEWPORTS) {
          await tab.setViewportSize({ width: vp.width, height: vp.height });
          await tab.waitForTimeout(150);
          const file = join(OUT, `${page.replace(/\.html$/, '')}-${lang}-${vp.name}.png`);
          await tab.screenshot({ path: file, fullPage: true });
          shots.push(file);
        }
      }

      await context.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

const ours = problems.filter((p) => p.kind !== 'external');
const external = problems.filter((p) => p.kind === 'external');

const byPage = new Map();
for (const p of ours) {
  const key = `${p.page} (${p.lang})`;
  if (!byPage.has(key)) byPage.set(key, []);
  byPage.get(key).push(p);
}

for (const [key, list] of byPage) {
  console.log(`\n${key}`);
  for (const p of list) console.log(`  ✗ [${p.kind}] ${p.detail}`);
}

if (external.length) {
  const hosts = [...new Set(external.map((p) => {
    const m = /https?:\/\/([^/\s]+)/.exec(p.detail);
    return m ? m[1] : 'third party';
  }))];
  console.log(`\nnote: ${external.length} third-party request(s) failed — ${hosts.join(', ')}`);
  console.log('      Expected when the sandbox has no outbound network. Not counted as a failure.');
}

if (shots.length) {
  console.log(`\n${shots.length} screenshots → .agent/runs/snapshots/`);
}

try {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'runtime.json'), JSON.stringify({ checkedAt: new Date().toISOString(), problems }, null, 2));
} catch { /* reporting only */ }

console.log('');
if (ours.length) {
  console.log(`BROWSER PASS FAILED — ${ours.length} problem${ours.length === 1 ? '' : 's'} across ${pages.length} pages`);
  process.exit(1);
}
console.log(`BROWSER PASS CLEAN — ${pages.length} pages × 2 languages, no runtime errors`);
