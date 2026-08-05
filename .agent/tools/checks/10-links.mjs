/**
 * Every internal href/src must resolve to a file that exists, and every
 * in-page anchor (#id) must have a matching element.
 *
 * Why: the site is hand-edited multi-page HTML with no build step and no
 * router. A renamed file produces a 404 that nothing else would catch.
 */
import { stripComments, lineOf } from '../lib.mjs';

export const id = 'links';
export const title = 'Internal links and assets resolve';

const EXTERNAL = /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i;

export function run(ctx) {
  const findings = [];

  for (const page of ctx.pages) {
    const src = stripComments(page.src);
    const ids = new Set([...src.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    ids.add('main');

    for (const m of src.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
      const url = m[1].trim();
      if (!url || EXTERNAL.test(url)) continue;

      const [pathPart, hash] = url.split('#');
      const clean = pathPart.split('?')[0];

      if (!clean) {
        if (hash && !ids.has(hash)) {
          findings.push({
            file: page.name,
            line: lineOf(src, m.index),
            msg: `anchor "#${hash}" has no matching element on this page`,
          });
        }
        continue;
      }

      if (!ctx.exists(clean)) {
        findings.push({
          file: page.name,
          line: lineOf(src, m.index),
          msg: `link target "${clean}" does not exist`,
          hint: 'Rename the target back, or update every page that points at it.',
        });
      }
    }
  }

  return findings;
}
