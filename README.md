# Northland Driving

A single-file website for **Northland Driving** — patient, one-on-one, beginner
driving lessons for adult women in Gladstone & the Kansas City Northland.
Women teaching women. No judgment, no rush. First lesson $30.

Everything lives in **`index.html`** — HTML, CSS, and JavaScript in one file, no
build step. Trilingual (English / Spanish / Tagalog) with a one-tap toggle.

## Run it

Just open `index.html` in a browser. That's it.

## Host it (free)

Pick any one:

- **Netlify** — drag the folder onto https://app.netlify.com/drop
- **Vercel** — `vercel` in this folder, or connect the repo at vercel.com
- **GitHub Pages** — repo → Settings → Pages → deploy from branch → `/ (root)`

Then point a domain at it. First-choice domains to check on a registrar:
`northlanddriving.com`, `drivenorthland.com`, `northlanddrivinglessons.com`.

## ✅ Fill these in before launch

Search `index.html` for `TODO`, `[`, and `000-0000`:

1. **Phone number** — in the `<script>`, set `BUSINESS_NUMBER` (digits only,
   e.g. `18165551234`) and `BUSINESS_DISPLAY` (e.g. `(816) 555-1234`).
   Also update the two visible "(816) 000-0000" strings (Book + Footer, and
   their `es`/`tl` translations) and the `telephone` in the JSON-LD block.
2. **Instructor name** — the site currently reads "your instructor" throughout,
   so it's launch-safe as is. Add her real name to the Instructor section and
   the review credit lines whenever you'd like.
3. **Payment methods** — FAQ answer `faq.a5` (and its `es`/`tl` versions) lists
   cash / Venmo / Cash App / Zelle. Trim to what she actually accepts.
4. **Reviews** — the three testimonials are clearly marked "Sample". Replace
   with real ones, or delete the whole `#reviews` section.
5. **Instructor photo** — drop a photo into the portrait placeholder in the
   Instructor section (replace the `.portrait` placeholder markup with an
   `<img>`).

## Missouri permit facts

The **Permit Help** section was verified against the Missouri Department of
Revenue in July 2026 (permit cost $10, valid 12 months, min age 15, accompaniment
rules, GDL steps). Laws change — the section carries a visible "confirm at the
official DOR links" notice, and all source links are included. Re-check before
each big share.
