/**
 * Bilingual coverage: the site ships English inline in the markup and
 * Tagalog in window.ND_DICT.tl (app.js). A key with no Tagalog entry
 * silently falls back to English — the visitor sees a half-translated
 * page and nothing errors. This check makes that visible.
 *
 * Also flags dictionary keys no page uses any more (dead weight that
 * misleads the next edit) and translations that lost their markup.
 */
import { findBlock, keysAtDepth, extractI18nSources, lineOf } from '../lib.mjs';

export const id = 'i18n';
export const title = 'Tagalog covers every translatable string';

export function run(ctx) {
  const findings = [];
  const app = ctx.scripts.find((s) => s.name === 'app.js');
  if (!app) {
    return [{ file: 'app.js', msg: 'app.js not found — the Tagalog dictionary lives here' }];
  }

  const dict = findBlock(app.src, 'tl');
  if (!dict) {
    return [{ file: 'app.js', msg: 'could not locate the `tl: { ... }` dictionary block' }];
  }

  const tlEntries = new Map();
  for (const entry of keysAtDepth(app.src, dict.start, dict.end, 1)) {
    tlEntries.set(entry.key, entry);
  }

  // key -> {pages, enSource}
  const used = new Map();
  for (const page of ctx.pages) {
    for (const [key, info] of extractI18nSources(page.src)) {
      if (!used.has(key)) used.set(key, { pages: [], info });
      used.get(key).pages.push(`${page.name}:${info.line}`);
    }
  }

  for (const [key, { pages }] of used) {
    if (!tlEntries.has(key)) {
      findings.push({
        file: pages[0].split(':')[0],
        line: Number(pages[0].split(':')[1]),
        msg: `"${key}" has no Tagalog translation — TL visitors see English here`,
        hint: `Add "${key}": "..." to the tl dictionary in app.js.`,
      });
    }
  }

  for (const [key, entry] of tlEntries) {
    if (!used.has(key)) {
      findings.push({
        level: 'warn',
        file: 'app.js',
        line: lineOf(app.src, entry.index),
        msg: `"${key}" is translated but no page uses it`,
        hint: 'Delete it, or restore the markup that used to carry this key.',
      });
    }
  }

  // A translation that drops inline markup breaks layout, because app.js
  // assigns the dictionary value straight to innerHTML.
  for (const [key, { pages, info }] of used) {
    const entry = tlEntries.get(key);
    if (!entry) continue;
    const enTags = (info.raw.match(/<(b|strong|em|i|br|span|a)\b/gi) || []).length;
    const tlValue = readValue(app.src, entry.valueAt);
    if (tlValue === null) continue;
    const tlTags = (tlValue.match(/<(b|strong|em|i|br|span|a)\b/gi) || []).length;
    if (enTags > 0 && tlTags === 0) {
      findings.push({
        level: 'warn',
        file: 'app.js',
        line: lineOf(app.src, entry.index),
        msg: `"${key}" drops the inline markup the English source uses (${enTags} tag${enTags === 1 ? '' : 's'})`,
        hint: `English source: ${pages[0]}`,
      });
    }
  }

  return findings;
}

function readValue(src, at) {
  let i = at;
  while (i < src.length && /\s/.test(src[i])) i++;
  if (src[i] !== '"' && src[i] !== "'") return null;
  const quote = src[i];
  let j = i + 1;
  let out = '';
  while (j < src.length) {
    if (src[j] === '\\') { out += src[j + 1]; j += 2; continue; }
    if (src[j] === quote) break;
    out += src[j];
    j++;
  }
  return out;
}
