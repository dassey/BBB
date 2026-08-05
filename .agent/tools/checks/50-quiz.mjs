/**
 * Permit-quiz bank integrity.
 *
 * The quiz is the one part of the site with real logic, and its failure
 * mode is silent: a question missing its Tagalog fields renders blank for
 * TL users, and an answer index pointing past the end of the options array
 * marks every attempt wrong. Neither throws.
 */
import { findBlock, objectsInArray, keysAtDepth, matchBlock, countArrayStrings, readString, lineOf } from '../lib.mjs';

export const id = 'quiz';
export const title = 'Permit quiz bank is complete and answerable';

const REQUIRED = ['q_en', 'q_tl', 'o_en', 'o_tl', 'a', 'e_en', 'e_tl'];

export function run(ctx) {
  const findings = [];
  const quiz = ctx.scripts.find((s) => s.name === 'quiz.js');
  if (!quiz) return [];

  const bank = findBlock(quiz.src, 'BANK');
  if (!bank) {
    return [{ file: 'quiz.js', msg: 'could not locate the `BANK = [ ... ]` question array' }];
  }

  const entries = objectsInArray(quiz.src, bank.start, bank.end);
  if (entries.length === 0) {
    return [{ file: 'quiz.js', msg: 'question bank is empty' }];
  }

  const seen = new Map();

  entries.forEach((obj, idx) => {
    const line = lineOf(quiz.src, obj.start);
    const fields = new Map();
    for (const f of keysAtDepth(quiz.src, obj.start, obj.end, 1)) fields.set(f.key, f);

    for (const req of REQUIRED) {
      if (!fields.has(req)) {
        findings.push({
          file: 'quiz.js',
          line,
          msg: `question ${idx + 1} is missing "${req}"`,
          hint: req.endsWith('_tl')
            ? 'Tagalog quiz takers get a blank string here.'
            : 'Every question needs all of: ' + REQUIRED.join(', '),
        });
      }
    }

    const lengths = {};
    for (const name of ['o_en', 'o_tl']) {
      const f = fields.get(name);
      if (!f) continue;
      let i = f.valueAt;
      while (i < quiz.src.length && /\s/.test(quiz.src[i])) i++;
      if (quiz.src[i] !== '[') {
        findings.push({ file: 'quiz.js', line, msg: `question ${idx + 1}: "${name}" is not an array` });
        continue;
      }
      const [s, e] = matchBlock(quiz.src, i);
      lengths[name] = countArrayStrings(quiz.src, s, e);
    }

    if (lengths.o_en != null && lengths.o_tl != null && lengths.o_en !== lengths.o_tl) {
      findings.push({
        file: 'quiz.js',
        line,
        msg: `question ${idx + 1}: ${lengths.o_en} English options but ${lengths.o_tl} Tagalog options`,
        hint: 'Option arrays are indexed in parallel — a length mismatch mislabels answers in one language.',
      });
    }

    const answer = fields.get('a');
    if (answer && lengths.o_en != null) {
      const m = /^\s*(-?\d+)/.exec(quiz.src.slice(answer.valueAt, answer.valueAt + 12));
      const value = m ? Number(m[1]) : NaN;
      if (!Number.isInteger(value) || value < 0 || value >= lengths.o_en) {
        findings.push({
          file: 'quiz.js',
          line,
          msg: `question ${idx + 1}: answer index ${m ? value : '(unparseable)'} is out of range for ${lengths.o_en} options`,
          hint: 'Indexes are 0-based; every attempt at this question would be scored wrong.',
        });
      }
    }

    const q = fields.get('q_en');
    if (q) {
      let i = q.valueAt;
      while (i < quiz.src.length && /\s/.test(quiz.src[i])) i++;
      if (quiz.src[i] === '"' || quiz.src[i] === "'") {
        const { value } = readString(quiz.src, i);
        const norm = value.toLowerCase().replace(/\s+/g, ' ').trim();
        if (seen.has(norm)) {
          findings.push({
            level: 'warn',
            file: 'quiz.js',
            line,
            msg: `question ${idx + 1} duplicates question ${seen.get(norm)}`,
          });
        } else {
          seen.set(norm, idx + 1);
        }
      }
    }
  });

  return findings;
}
