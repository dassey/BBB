/**
 * Stylesheet and web-font wiring.
 *
 * This site has no bundler, so every font and stylesheet is referenced by
 * hand in six files plus styles.css. The failures that hide here are quiet
 * ones: a font family renamed in CSS but never requested (silent fallback
 * to system fonts), a page that forgets a stylesheet, and @import chains
 * that serialise font loading behind the CSS download.
 */
import { stripComments, lineOf } from '../lib.mjs';

export const id = 'assets';
export const title = 'Stylesheets and web fonts are wired consistently';

const GENERIC = new Set([
  'system-ui', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy',
  'ui-monospace', 'ui-sans-serif', 'ui-serif', '-apple-system', 'blinkmacsystemfont',
  'segoe ui', 'roboto', 'helvetica neue', 'helvetica', 'arial', 'inherit', 'initial', 'unset',
]);

export function run(ctx) {
  const findings = [];

  const cssFiles = ctx.files.filter((f) => f.endsWith('.css'));
  const fontUrls = [];

  /* Font stylesheets requested from pages. */
  for (const page of ctx.pages) {
    const src = stripComments(page.src);
    for (const m of src.matchAll(/<link[^>]+href="(https:\/\/fonts\.googleapis\.com\/[^"]+)"/g)) {
      fontUrls.push(m[1]);
    }
  }

  /* Font stylesheets pulled in from CSS. */
  for (const file of cssFiles) {
    const src = ctx.read(file);
    for (const m of src.matchAll(/@import\s+url\(\s*['"]?(https?:\/\/[^'")]+)['"]?\s*\)/g)) {
      fontUrls.push(m[1]);
      findings.push({
        level: 'warn',
        file,
        line: lineOf(src, m.index),
        msg: '@import of a remote stylesheet blocks rendering until this file has downloaded',
        hint: 'Move it to a <link rel="stylesheet"> in each page <head> so the browser can fetch it in parallel.',
      });
    }
  }

  /* Which families did we actually ask for? */
  const requested = new Set();
  for (const url of fontUrls) {
    for (const m of url.matchAll(/family=([^&:]+)/g)) {
      requested.add(decodeURIComponent(m[1]).replace(/\+/g, ' ').toLowerCase());
    }
  }

  /* Which families does the CSS name?
   *
   * The stacks live in custom properties (--f-display: 'Outfit', …) and are
   * referenced as font-family: var(--f-display), so scanning font-family
   * alone finds nothing but var() calls. Treat any declaration whose value
   * ends in a generic family as a font stack, whatever its property name. */
  for (const file of cssFiles) {
    // Comments are blanked rather than removed so reported line numbers still
    // point at the real declaration.
    const src = ctx.read(file).replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));
    for (const m of src.matchAll(/(?:^|[;{])\s*((?:--)?[\w-]+)\s*:\s*([^;}]+)/gm)) {
      const [, prop, value] = m;
      const isFontStack =
        /^font-family$/i.test(prop) ||
        (/(system-ui|sans-serif|serif|monospace|cursive)\s*$/i.test(value.trim()) && /['"]/.test(value));
      if (!isFontStack) continue;

      for (const part of value.split(',')) {
        const name = part.trim().replace(/^['"]|['"]$/g, '');
        if (!name || name.startsWith('var(') || name.startsWith('--')) continue;
        const lower = name.toLowerCase();
        if (GENERIC.has(lower)) continue;
        if (!requested.has(lower)) {
          findings.push({
            file,
            line: lineOf(src, m.index),
            msg: `font "${name}" is used by ${prop} but never requested by any stylesheet link`,
            hint: 'Browsers fall back silently — the page looks subtly wrong rather than broken.',
          });
        }
      }
    }
  }

  /* Every page should load the same stylesheets. */
  const sheetsPerPage = ctx.pages.map((page) => {
    const src = stripComments(page.src);
    const sheets = [...src.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)]
      .map((m) => /href="([^"]+)"/.exec(m[0]))
      .filter(Boolean)
      .map((m) => m[1])
      .sort();
    return { page: page.name, sheets };
  });

  if (sheetsPerPage.length > 1) {
    // A stylesheet most pages load is a shared one; a page missing it renders
    // without the design system, which is a break rather than a difference.
    const usage = new Map();
    for (const s of sheetsPerPage) {
      for (const sheet of new Set(s.sheets)) usage.set(sheet, (usage.get(sheet) || 0) + 1);
    }
    const shared = [...usage.entries()]
      .filter(([, count]) => count > sheetsPerPage.length / 2)
      .map(([sheet]) => sheet);

    for (const s of sheetsPerPage) {
      for (const sheet of shared) {
        if (!s.sheets.includes(sheet)) {
          findings.push({
            file: s.page,
            msg: `does not load "${sheet}", which every other page loads`,
            hint: 'The page will render unstyled.',
          });
        }
      }
      const extra = s.sheets.filter((sheet) => !shared.includes(sheet));
      for (const sheet of extra) {
        findings.push({
          level: 'warn',
          file: s.page,
          msg: `loads "${sheet}", which no other page loads`,
        });
      }
    }
  }

  return findings;
}
