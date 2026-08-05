/**
 * Prices are quoted across six pages, the JSON-LD and a booking form.
 * .agent/facts.json is the single source of truth; this check fails until
 * every surface agrees with it.
 *
 * Any dollar amount a page prints must be one facts.json knows about —
 * a tier price, a derived per-hour or saving figure, or a third-party fee
 * under `external.fees`.
 */
import { stripComments, dollarAmounts, lineOf } from '../lib.mjs';

export const id = 'pricing';
export const title = 'Prices agree across pages and JSON-LD';

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
    // Anchor each price tag to the tier whose name card precedes it. This
    // used to key off `data-i18n="pricing.tN."`; those hooks are gone
    // (Decision 10), and an anchor that matches nothing makes the whole
    // rule pass vacuously — which is how this was caught.
    const marks = [...src.matchAll(/class="t-name"\s*>\s*([^<]+?)\s*</g)]
      .map((m) => ({ index: m.index, tier: tiers.find((t) => t.name === m[1]) }))
      .filter((m) => m.tier);
    for (const t of tiers) {
      if (!marks.some((m) => m.tier.id === t.id)) {
        findings.push({
          file: pricingPage.name,
          msg: `no card on the pricing page is named "${t.name}" (tier ${t.id})`,
          hint: 'Prices are scoped to their tier by the .t-name card above them.',
        });
      }
    }
    for (const m of src.matchAll(/class="price"\s*>\s*\$([0-9,]+)/g)) {
      const amount = Number(m[1].replace(/,/g, ''));
      const owner = marks.filter((k) => k.index < m.index).pop();
      const tier = owner ? owner.tier : null;
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

  /* ---- 3. the booking form's option labels ---- */
  // P-11: the contact form quotes prices too, and a stale one here books a
  // customer at a rate the business does not charge. Section 2 only warns
  // about unknown amounts anywhere; this is the surface that must be exact.
  const contactPage = ctx.pages.find((p) => p.name === 'contact.html');
  if (contactPage) {
    const src = stripComments(contactPage.src);
    for (const m of src.matchAll(/<option[^>]*>([^<]*)<\/option>/g)) {
      for (const amount of dollarAmounts(m[1])) {
        if (!canonical.has(amount)) {
          findings.push({
            file: contactPage.name,
            line: lineOf(src, m.index),
            msg: `booking option "${m[1].trim()}" quotes $${amount}, which is not a tier price`,
            hint: `Tier prices: ${tiers.map((t) => '$' + t.price).join(', ')}. Update .agent/facts.json first if it really changed.`,
          });
        }
      }
    }
  }

  /* ---- 4. JSON-LD offers ---- */
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
