/**
 * Prices are quoted in nine places across six pages, two languages, JSON-LD
 * and a booking form. .agent/facts.json is the single source of truth; this
 * check fails until every surface agrees with it.
 *
 * The sharpest rule here is tier scoping: a dollar amount inside a
 * `pricing.tN.*` translation must be an amount that belongs to tier N —
 * its price, its per-hour rate, or its saving against the base hourly rate.
 * That is what catches a dictionary whose tiers have drifted out of the
 * order the markup uses.
 */
import { findBlock, keysAtDepth, stripComments, dollarAmounts, lineOf, readString } from '../lib.mjs';

export const id = 'pricing';
export const title = 'Prices agree across pages, languages and JSON-LD';

export function run(ctx) {
  const findings = [];
  const facts = JSON.parse(ctx.read('.agent/facts.json'));
  const tiers = facts.tiers;
  const base = tiers.find((t) => t.isBaseHourly) || tiers[0];
  const canonical = new Set(tiers.map((t) => t.price));

  const allowedFor = (tier) => {
    const set = new Set([tier.price]);
    if (tier.hours > 0) {
      const perHour = tier.price / tier.hours;
      if (Number.isInteger(perHour)) set.add(perHour);
      const saving = base.price * tier.hours - tier.price;
      if (saving > 0) set.add(saving);
    }
    return set;
  };

  /* ---- 1. the pricing page's own price tags ---- */
  const pricingPage = ctx.pages.find((p) => p.name === 'pricing.html');
  if (pricingPage) {
    const src = stripComments(pricingPage.src);
    const marks = [...src.matchAll(/data-i18n="pricing\.(t\d)\./g)];
    for (const m of src.matchAll(/class="price"\s*>\s*\$([0-9,]+)/g)) {
      const amount = Number(m[1].replace(/,/g, ''));
      const owner = [...marks].filter((k) => k.index < m.index).pop();
      const tier = owner ? tiers.find((t) => t.id === owner[1]) : null;
      if (!tier) continue;
      if (tier.price !== amount) {
        findings.push({
          file: pricingPage.name,
          line: lineOf(src, m.index),
          msg: `tier ${tier.id} shows $${amount} but facts.json says $${tier.price}`,
          hint: 'Update .agent/facts.json first if the price really changed, then propagate.',
        });
      }
    }
    for (const t of tiers) {
      if (!src.includes(`$${t.price}`)) {
        findings.push({
          file: pricingPage.name,
          msg: `no card on the pricing page quotes $${t.price} (${t.name})`,
        });
      }
    }
  }

  /* ---- 2. every dollar amount on every page is a known amount ---- */
  const known = new Set([
    ...canonical,
    ...Object.values(facts.external.fees || {}).filter((v) => typeof v === 'number'),
    ...tiers.flatMap((t) => [...allowedFor(t)]),
  ]);
  for (const page of ctx.pages) {
    const src = stripComments(page.src);
    for (const m of src.matchAll(/\$\s?([0-9][0-9,]*)/g)) {
      const amount = Number(m[1].replace(/,/g, ''));
      if (!known.has(amount)) {
        findings.push({
          level: 'warn',
          file: page.name,
          line: lineOf(src, m.index),
          msg: `$${amount} is not a price in facts.json`,
          hint: `Known amounts: ${[...known].sort((a, b) => a - b).map((n) => '$' + n).join(', ')}`,
        });
      }
    }
  }

  /* ---- 3. tier-scoped amounts inside translations ---- */
  for (const script of ctx.scripts) {
    const dict = findBlock(script.src, 'tl');
    if (!dict) continue;
    for (const entry of keysAtDepth(script.src, dict.start, dict.end, 1)) {
      const tier = tiers.find((t) => entry.key.startsWith(t.keyPrefix + '.'));
      if (!tier) continue;
      let i = entry.valueAt;
      while (i < script.src.length && /\s/.test(script.src[i])) i++;
      if (script.src[i] !== '"' && script.src[i] !== "'") continue;
      const { value } = readString(script.src, i);
      const allowed = allowedFor(tier);
      for (const amount of dollarAmounts(value)) {
        if (!allowed.has(amount)) {
          const belongsTo = tiers.find((t) => t.price === amount);
          findings.push({
            file: script.name,
            line: lineOf(script.src, entry.index),
            msg: `"${entry.key}" quotes $${amount}, which does not belong to tier ${tier.id} (${tier.name}, $${tier.price})`,
            hint: belongsTo
              ? `$${amount} is tier ${belongsTo.id} — "${belongsTo.name}". The dictionary tiers look swapped relative to the markup.`
              : `Amounts valid for ${tier.id}: ${[...allowed].map((n) => '$' + n).join(', ')}.`,
          });
        }
      }
    }
  }

  /* ---- 4. tier names must not be another tier's name ---- */
  for (const script of ctx.scripts) {
    const dict = findBlock(script.src, 'tl');
    if (!dict) continue;
    for (const entry of keysAtDepth(script.src, dict.start, dict.end, 1)) {
      const tier = tiers.find((t) => entry.key === t.keyPrefix + '.name');
      if (!tier) continue;
      let i = entry.valueAt;
      while (i < script.src.length && /\s/.test(script.src[i])) i++;
      if (script.src[i] !== '"' && script.src[i] !== "'") continue;
      const { value } = readString(script.src, i);
      const other = tiers.find((t) => t.id !== tier.id && value.toLowerCase().includes(t.name.toLowerCase()));
      if (other) {
        findings.push({
          file: script.name,
          line: lineOf(script.src, entry.index),
          msg: `"${entry.key}" is named "${value}", which is tier ${other.id}'s product`,
          hint: 'The markup and the dictionary disagree about which card is which.',
        });
      }
    }
  }

  /* ---- 5. JSON-LD offers ---- */
  for (const page of ctx.pages) {
    for (const block of page.src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      let data;
      try {
        data = JSON.parse(block[1]);
      } catch (err) {
        findings.push({
          file: page.name,
          line: lineOf(page.src, block.index),
          msg: `JSON-LD block is not valid JSON (${err.message}) — search engines will drop it`,
        });
        continue;
      }
      for (const offer of [].concat(data.makesOffer || [])) {
        const price = Number(offer.price);
        if (!Number.isFinite(price)) continue;
        if (!canonical.has(price)) {
          findings.push({
            file: page.name,
            line: lineOf(page.src, block.index),
            msg: `JSON-LD offer "${offer.name}" is $${price}, which is not a price in facts.json`,
          });
        }
      }
      if (typeof data.priceRange === 'string') {
        const bounds = dollarAmounts(data.priceRange);
        const lo = Math.min(...canonical);
        const hi = Math.max(...canonical);
        if (bounds.length === 2 && (bounds[0] !== lo || bounds[1] !== hi)) {
          findings.push({
            file: page.name,
            line: lineOf(page.src, block.index),
            msg: `JSON-LD priceRange is "${data.priceRange}" but the real range is $${lo}–$${hi}`,
          });
        }
      }
      if (data.email && data.email !== facts.business.email) {
        findings.push({
          file: page.name,
          line: lineOf(page.src, block.index),
          msg: `JSON-LD email "${data.email}" does not match facts.json (${facts.business.email})`,
        });
      }
    }
  }

  return findings;
}
