/**
 * Decision 5 (.agent/memory/decisions.md): the lead instructor's name
 * appears only on about.html. Every other surface uses the team voice
 * ("our drivers" / "our team").
 *
 * This decision has already been re-litigated once by hand across seven
 * files. Encoding it here means the next edit cannot quietly undo it.
 */
import { stripComments, lineOf } from '../lib.mjs';

export const id = 'brand';
export const title = 'Lead-instructor naming stays inside its boundary';

export function run(ctx) {
  const findings = [];
  const facts = JSON.parse(ctx.read('data/facts.json'));
  const name = facts.brand.leadInstructor;
  const allowedPages = new Set(facts.brand.leadInstructorPagesAllowed);
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

  return findings;
}
