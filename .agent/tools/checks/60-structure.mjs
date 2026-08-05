/**
 * Per-page structure: the accessibility and SEO basics that are easy to
 * drop when copying a page as the starting point for a new one.
 *
 * Every page on this site is hand-copied from a sibling, so these are the
 * things that go missing in practice: a stale canonical URL pointing at the
 * page it was copied from, a second <h1>, an <img> with no alt text.
 */
import { stripComments, lineOf } from '../lib.mjs';

export const id = 'structure';
export const title = 'Page structure, accessibility and SEO basics';

export function run(ctx) {
  const findings = [];
  const facts = JSON.parse(ctx.read('data/facts.json'));
  const domain = facts.business.domain;

  for (const page of ctx.pages) {
    const raw = page.src;
    const src = stripComments(raw);
    const at = (re) => {
      const m = re.exec(src);
      return m ? lineOf(src, m.index) : undefined;
    };

    const h1s = [...src.matchAll(/<h1[\s>]/g)];
    if (h1s.length === 0) {
      findings.push({ file: page.name, msg: 'no <h1> — the page has no primary heading' });
    } else if (h1s.length > 1) {
      findings.push({
        file: page.name,
        line: lineOf(src, h1s[1].index),
        msg: `${h1s.length} <h1> elements — a page should have exactly one`,
      });
    }

    if (!/<html[^>]*\blang="[a-z]{2}"/i.test(src)) {
      findings.push({ file: page.name, line: 1, msg: '<html> is missing a lang attribute' });
    }

    for (const m of src.matchAll(/<img\b[^>]*>/g)) {
      if (!/\salt=/.test(m[0])) {
        findings.push({
          file: page.name,
          line: lineOf(src, m.index),
          msg: 'an <img> has no alt attribute',
          hint: 'Use alt="" if the image is decorative.',
        });
      }
    }

    for (const [label, re] of [
      ['<title>', /<title[\s>]/],
      ['meta description', /<meta\s+name="description"/],
      ['canonical link', /rel="canonical"/],
      ['og:image', /property="og:image"/],
      ['og:title', /property="og:title"/],
    ]) {
      if (!re.test(src)) {
        findings.push({ file: page.name, msg: `missing ${label}` });
      }
    }

    const canonical = /rel="canonical"\s+href="([^"]+)"|href="([^"]+)"\s+rel="canonical"/.exec(src);
    if (canonical) {
      const href = canonical[1] || canonical[2];
      const expected = page.name === 'index.html' ? `https://${domain}/` : `https://${domain}/${page.name}`;
      if (href !== expected) {
        findings.push({
          file: page.name,
          line: at(/rel="canonical"/),
          msg: `canonical is "${href}" but this page is "${expected}"`,
          hint: 'A canonical copied from another page tells search engines to ignore this one.',
        });
      }
    }

    if (!/class="skip"/.test(src)) {
      findings.push({
        level: 'warn',
        file: page.name,
        msg: 'no skip-to-content link',
        hint: 'Keyboard users tab through the whole nav without it.',
      });
    }

    if (!/<script[^>]+src="app\.js"/.test(src)) {
      findings.push({
        file: page.name,
        msg: 'does not load app.js — the nav and booking form will not work',
      });
    }
  }

  return findings;
}
