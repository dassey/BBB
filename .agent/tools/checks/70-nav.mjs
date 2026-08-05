/**
 * Navigation and contact details must be identical on every page.
 *
 * There is no layout include here — the header and footer are copy-pasted
 * into six files. Adding a page means editing all six, and the failure mode
 * is a nav that lists the new page on some pages but not others.
 */
import { stripComments, lineOf } from '../lib.mjs';

export const id = 'nav';
export const title = 'Header, footer and contact details match across pages';

export function run(ctx) {
  const findings = [];
  const facts = JSON.parse(ctx.read('.agent/facts.json'));

  const navOf = (page) => {
    const src = stripComments(page.src);
    const m = /<nav\b[^>]*class="main-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(src);
    if (!m) return null;
    return [...m[1].matchAll(/href="([^"]+)"/g)].map((h) => h[1]);
  };

  const navs = ctx.pages.map((p) => ({ page: p, links: navOf(p) }));
  const missing = navs.filter((n) => n.links === null);
  for (const n of missing) {
    findings.push({ file: n.page.name, msg: 'no <nav class="main-nav"> found' });
  }

  const present = navs.filter((n) => n.links !== null);
  if (present.length > 1) {
    // The most common nav wins; anything else is the anomaly.
    const tally = new Map();
    for (const n of present) {
      const sig = n.links.join(' | ');
      tally.set(sig, (tally.get(sig) || 0) + 1);
    }
    const [canonical] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
    for (const n of present) {
      const sig = n.links.join(' | ');
      if (sig !== canonical) {
        findings.push({
          file: n.page.name,
          msg: `nav differs from the other ${present.length - 1} pages`,
          hint: `this page: ${sig || '(empty)'}\n      elsewhere: ${canonical}`,
        });
      }
    }
  }

  // Every page must be reachable from the nav.
  if (present.length) {
    const linked = new Set(present.flatMap((n) => n.links.map((l) => l.split('#')[0])));
    linked.add('index.html');
    for (const page of ctx.pages) {
      if (!linked.has(page.name)) {
        findings.push({
          level: 'warn',
          file: page.name,
          msg: 'exists but no page links to it from the main nav',
        });
      }
    }
  }

  // Contact details are quoted in markup, mailto: links and JSON-LD.
  const email = facts.business.email;
  for (const page of ctx.pages) {
    const src = stripComments(page.src);
    for (const m of src.matchAll(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi)) {
      const found = m[0];
      if (found === email) continue;
      if (/example\.com$|halimbawa\.com$/i.test(found)) continue; // documented placeholders
      findings.push({
        file: page.name,
        line: lineOf(src, m.index),
        msg: `contact address "${found}" is not the address in facts.json (${email})`,
      });
    }
  }

  for (const script of ctx.scripts) {
    for (const m of script.src.matchAll(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi)) {
      const found = m[0];
      if (found === email) continue;
      if (/example\.com$|halimbawa\.com$/i.test(found)) continue;
      findings.push({
        file: script.name,
        line: lineOf(script.src, m.index),
        msg: `contact address "${found}" is not the address in facts.json (${email})`,
      });
    }
  }

  return findings;
}
