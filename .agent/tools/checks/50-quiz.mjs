/**
 * Permit-quiz bank integrity.
 *
 * The quiz is the one part of the site with real logic, and its failure
 * mode is silent: a question missing a field renders blank, and an answer
 * index pointing past the end of the options array marks every attempt
 * wrong. Neither throws.
 */
import { findBlock, objectsInArray, keysAtDepth, matchBlock, countArrayStrings, readString, lineOf } from '../lib.mjs';

export const id = 'quiz';
export const title = 'Permit quiz bank is complete and answerable';

const REQUIRED = ['q', 'o', 'a', 'e'];

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
          hint: 'Every question needs all of: ' + REQUIRED.join(', '),
        });
      }
    }

    let optionCount = null;
    const opts = fields.get('o');
    if (opts) {
      let i = opts.valueAt;
      while (i < quiz.src.length && /\s/.test(quiz.src[i])) i++;
      if (quiz.src[i] !== '[') {
        findings.push({ file: 'quiz.js', line, msg: `question ${idx + 1}: "o" is not an array` });
      } else {
        const [s, e] = matchBlock(quiz.src, i);
        optionCount = countArrayStrings(quiz.src, s, e);
      }
    }

    const answer = fields.get('a');
    if (answer && optionCount != null) {
      const m = /^\s*(-?\d+)/.exec(quiz.src.slice(answer.valueAt, answer.valueAt + 12));
      const value = m ? Number(m[1]) : NaN;
      if (!Number.isInteger(value) || value < 0 || value >= optionCount) {
        findings.push({
          file: 'quiz.js',
          line,
          msg: `question ${idx + 1}: answer index ${m ? value : '(unparseable)'} is out of range for ${optionCount} options`,
          hint: 'Indexes are 0-based; every attempt at this question would be scored wrong.',
        });
      }
    }

    const q = fields.get('q');
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
