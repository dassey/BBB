/**
 * Shared parsing helpers for the Northland Driving verifier.
 *
 * These are deliberately dependency-free and string-aware rather than
 * regex-only: the site's dictionaries contain braces, apostrophes and
 * escaped quotes inside translated copy, which naive regex splitting
 * gets wrong (and silently under-reports).
 */

/** Convert a character index into a 1-based line number. */
export function lineOf(src, index) {
  let line = 1;
  for (let i = 0; i < index && i < src.length; i++) {
    if (src[i] === '\n') line++;
  }
  return line;
}

/**
 * Find the balanced block that starts at `open` (an index pointing at
 * `{` or `[`) and return [startIndex, endIndexExclusive].
 * String literals and comments are skipped so braces inside copy do not
 * throw off the depth count.
 */
export function matchBlock(src, open) {
  const pairs = { '{': '}', '[': ']' };
  const closer = pairs[src[open]];
  if (!closer) throw new Error(`matchBlock: index ${open} is not { or [`);
  let depth = 0;
  let i = open;
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      i = skipString(src, i);
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? src.length : end + 2;
      continue;
    }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') {
      depth--;
      if (depth === 0) return [open, i + 1];
    }
    i++;
  }
  throw new Error(`matchBlock: unbalanced block starting at index ${open}`);
}

/** Given an index pointing at a quote character, return the index just past the closing quote. */
export function skipString(src, i) {
  const quote = src[i];
  let j = i + 1;
  while (j < src.length) {
    if (src[j] === '\\') { j += 2; continue; }
    if (src[j] === quote) return j + 1;
    j++;
  }
  return src.length;
}

/** Read a string literal starting at `i` (which points at the quote). Returns {value, end}. */
export function readString(src, i) {
  const quote = src[i];
  let j = i + 1;
  let value = '';
  while (j < src.length) {
    if (src[j] === '\\') {
      const next = src[j + 1];
      value += next === 'n' ? '\n' : next === 't' ? '\t' : next;
      j += 2;
      continue;
    }
    if (src[j] === quote) return { value, end: j + 1 };
    value += src[j];
    j++;
  }
  return { value, end: src.length };
}

/**
 * Walk an object/array block and yield every `key:` that sits at the given
 * depth relative to the block. Depth 1 == direct members of the block.
 * Handles both quoted ("a.b": v) and bare (a_b: v) keys.
 */
export function keysAtDepth(src, blockStart, blockEnd, wantDepth = 1) {
  const out = [];
  let depth = 0;
  let i = blockStart;
  while (i < blockEnd) {
    const c = src[i];

    if (c === '/' && src[i + 1] === '/') {
      while (i < blockEnd && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? blockEnd : end + 2;
      continue;
    }

    if (c === '"' || c === "'") {
      const { value, end } = readString(src, i);
      let k = end;
      while (k < blockEnd && /\s/.test(src[k])) k++;
      if (depth === wantDepth && src[k] === ':') {
        out.push({ key: value, index: i, valueAt: k + 1 });
      }
      i = end;
      continue;
    }
    if (c === '`') { i = skipString(src, i); continue; }

    if (c === '{' || c === '[') { depth++; i++; continue; }
    if (c === '}' || c === ']') { depth--; i++; continue; }

    // Bare identifier key, e.g. `q_en:` or `a:`
    if (depth === wantDepth && /[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < blockEnd && /[\w$]/.test(src[j])) j++;
      let k = j;
      while (k < blockEnd && /\s/.test(src[k])) k++;
      if (src[k] === ':') {
        out.push({ key: src.slice(i, j), index: i, valueAt: k + 1 });
        i = k + 1;
        continue;
      }
      i = j;
      continue;
    }

    i++;
  }
  return out;
}

/**
 * Locate a named block, e.g. findBlock(src, 'tl') for `tl: {` or
 * findBlock(src, 'BANK') for `var BANK = [`.
 * Returns {start, end} indices of the balanced block, or null.
 */
export function findBlock(src, name) {
  const re = new RegExp(`(?:^|[^\\w$])${name}\\s*(?::|=)\\s*([[{])`, 'm');
  const m = re.exec(src);
  if (!m) return null;
  const open = m.index + m[0].length - 1;
  const [start, end] = matchBlock(src, open);
  return { start, end };
}

/** Top-level object members of an array block, as {start, end} index pairs. */
export function objectsInArray(src, arrStart, arrEnd) {
  const out = [];
  let depth = 0;
  let i = arrStart;
  while (i < arrEnd) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') { i = skipString(src, i); continue; }
    if (c === '/' && src[i + 1] === '/') {
      while (i < arrEnd && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? arrEnd : end + 2;
      continue;
    }
    if (c === '[') { depth++; i++; continue; }
    if (c === ']') { depth--; i++; continue; }
    if (c === '{' && depth === 1) {
      const [s, e] = matchBlock(src, i);
      out.push({ start: s, end: e });
      i = e;
      continue;
    }
    if (c === '{') { depth++; i++; continue; }
    if (c === '}') { depth--; i++; continue; }
    i++;
  }
  return out;
}

/** Count string elements at the top level of an array literal. */
export function countArrayStrings(src, arrStart, arrEnd) {
  let depth = 0;
  let count = 0;
  let i = arrStart;
  while (i < arrEnd) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      if (depth === 1) count++;
      i = skipString(src, i);
      continue;
    }
    if (c === '[' || c === '{') { depth++; i++; continue; }
    if (c === ']' || c === '}') { depth--; i++; continue; }
    i++;
  }
  return count;
}

/** Strip HTML comments so checks do not fire on commented-out markup. */
export function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length));
}

/**
 * Extract the English source string for every data-i18n / data-i18n-ph key
 * in a page. English is not stored in a dictionary — app.js harvests it from
 * the inline markup at load — so the markup *is* the EN source of truth.
 * Returns Map<key, {raw, text, line, kind}>.
 */
export function extractI18nSources(html) {
  const out = new Map();
  const src = stripComments(html);
  const re = /data-i18n(-ph)?="([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    const isPh = Boolean(m[1]);
    const key = m[2];
    const line = lineOf(src, m.index);

    if (isPh) {
      const tagEnd = endOfOpenTag(src, m.index);
      const openTag = src.slice(backToTagStart(src, m.index), tagEnd);
      const ph = /placeholder="([^"]*)"/.exec(openTag);
      if (!out.has(key)) out.set(key, { raw: ph ? ph[1] : '', text: ph ? ph[1] : '', line, kind: 'ph' });
      continue;
    }

    const start = backToTagStart(src, m.index);
    const nameMatch = /^<([a-zA-Z][\w-]*)/.exec(src.slice(start));
    if (!nameMatch) continue;
    const tag = nameMatch[1];
    const tagEnd = endOfOpenTag(src, m.index);
    if (src[tagEnd - 2] === '/') {
      if (!out.has(key)) out.set(key, { raw: '', text: '', line, kind: 'void' });
      continue;
    }
    const close = findCloseTag(src, tagEnd, tag);
    const raw = close < 0 ? '' : src.slice(tagEnd, close);
    if (!out.has(key)) {
      out.set(key, { raw, text: raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(), line, kind: tag });
    }
  }
  return out;
}

function backToTagStart(src, from) {
  let i = from;
  while (i >= 0 && src[i] !== '<') i--;
  return Math.max(i, 0);
}

function endOfOpenTag(src, from) {
  let i = from;
  while (i < src.length) {
    if (src[i] === '"' || src[i] === "'") { i = skipString(src, i); continue; }
    if (src[i] === '>') return i + 1;
    i++;
  }
  return src.length;
}

function findCloseTag(src, from, tag) {
  const open = new RegExp(`<${tag}[\\s/>]`, 'gi');
  const close = new RegExp(`</${tag}\\s*>`, 'gi');
  let depth = 0;
  let i = from;
  while (i < src.length) {
    open.lastIndex = i;
    close.lastIndex = i;
    const o = open.exec(src);
    const cl = close.exec(src);
    if (!cl) return -1;
    if (o && o.index < cl.index) { depth++; i = o.index + 1; continue; }
    if (depth === 0) return cl.index;
    depth--;
    i = cl.index + 1;
  }
  return -1;
}

/** Every dollar amount in a string, as numbers. */
export function dollarAmounts(str) {
  return [...String(str).matchAll(/\$\s?([0-9][0-9,]*(?:\.[0-9]{2})?)/g)]
    .map((m) => Number(m[1].replace(/,/g, '')))
    .filter((n) => Number.isFinite(n));
}
