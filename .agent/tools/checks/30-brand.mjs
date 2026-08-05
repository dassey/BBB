/**
 * Decision 5 (.agent/memory/decisions.md): the lead instructor's name
 * appears only on about.html and under about.* dictionary keys. Every
 * other surface uses the team voice ("our drivers" / "our team").
 *
 * This decision has already been re-litigated once by hand across seven
 * files. Encoding it here means the next edit cannot quietly undo it.
 */
import { findBlock, keysAtDepth, stripComments, lineOf } from '../lib.mjs';

export const id = 'brand';
export const title = 'Lead-instructor naming stays inside its boundary';

export function run(ctx) {
  const findings = [];
  const facts = JSON.parse(ctx.read('.agent/facts.json'));
  const name = facts.brand.leadInstructor;
  const allowedPages = new Set(facts.brand.leadInstructorPagesAllowed);
  const allowedPrefixes = facts.brand.leadInstructorKeyPrefixAllowed;
  const re = new RegExp(`\\b${name}\\b`, 'g');

  for (const page of ctx.pages) {
    if (allowedPages.has(page.name)) continue;
    const src = stripComments(page.src);
    for (const m of src.matchAll(re)) {
      findings.push({
        file: page.name,
        line: lineOf(src, m.index),
        msg: `"${name}" appears outside ${[...allowedPages].join(', ')}`,
        hint: 'Use the team voice here — "our drivers" / "our team". See Decision 5.',
      });
    }
  }

  // In the dictionary, the name is only allowed under about.* keys.
  for (const script of ctx.scripts) {
    const dict = findBlock(script.src, 'tl');
    if (!dict) continue;
    const keys = keysAtDepth(script.src, dict.start, dict.end, 1)
      .sort((a, b) => a.index - b.index);

    for (const m of script.src.matchAll(re)) {
      if (m.index < dict.start || m.index >= dict.end) continue;
      let owner = null;
      for (const k of keys) {
        if (k.index <= m.index) owner = k.key;
        else break;
      }
      const ok = owner && allowedPrefixes.some((p) => owner.startsWith(p));
      if (!ok) {
        findings.push({
          file: script.name,
          line: lineOf(script.src, m.index),
          msg: `"${name}" used under dictionary key "${owner ?? '(unknown)'}" — only ${allowedPrefixes.join(', ')}* may name the lead instructor`,
          hint: 'See Decision 5 in .agent/memory/decisions.md.',
        });
      }
    }
  }

  return findings;
}
