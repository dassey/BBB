# Northland Driving

Website for **Northland Driving** — calm, patient one-on-one driving lessons for
adults in Gladstone & the Kansas City Northland. Woman-owned. Lessons in English
or Tagalog.

Static multi-page site, no build step. Trilingual (English / Spanish / Tagalog)
via a toggle in the header.

## Files

| File | What it is |
|------|-----------|
| `index.html` | Home |
| `about.html` | About / the instructor |
| `pricing.html` | Pricing + payment FAQ |
| `permit.html` | Missouri permit help |
| `contact.html` | Book a lesson (opens a pre-filled email) |
| `styles.css` | Shared design system |
| `app.js` | Shared behaviour: nav, language toggle, FAQ, booking email |

## Run it

Open `index.html` in a browser.

## Host it (free)

- **GitHub Pages** — repo → Settings → Pages → Build from branch → `main` / root
- **Netlify** — drag the folder onto https://app.netlify.com/drop
- **Vercel** — connect the repo

Then point **northlanddriving.com** at it (each host has a "custom domain" step).

## ✅ Fill these in before launch

1. **Contact email** — set `window.ND_EMAIL` at the top of `app.js`. It's currently
   `hello@northlanddriving.com`. The site has no phone number by design; the
   Contact form and every "email us" link use this address.
2. **Instructor name** — the site reads "she / your instructor" throughout, so it's
   launch-safe. Add her name on `about.html` whenever you like.
3. **Payment methods** — one FAQ line on `pricing.html` (key `pricing.a1`, and its
   `es`/`tl` versions in `app.js`). Trim to what she actually accepts.
4. **Permit facts** — verified against the Missouri DOR in July 2026. Laws change;
   the page shows a "confirm at the official links" note. Re-check before big shares.

## 🖼️ Graphics to add (optional, but they'll lift it further)

The site ships with clean built-in SVG graphics (the route-map hero, icons, the
brand mark), so nothing is *missing*. If you want to add real imagery, these are
the highest-impact slots. Drop files into an `images/` folder and swap them in
where noted.

1. **Instructor photo** — `about.html`, the dark portrait frame.
   Portrait orientation (4:5), ~1000×1250px, warm and friendly. This is the single
   most valuable image on the site — a real face builds trust fast.
   Swap: replace the `<div class="ph">…</div>` block with `<img src="images/instructor.jpg" alt="Your instructor">`.
2. **Social share image** — 1200×630px, for when the link is posted on Nextdoor /
   Facebook (the preview card). Simple: logo + "Learn to drive at your own pace" on
   the concrete background. Save as `images/og.jpg` and I can wire up the meta tags.
3. **A lesson / car photo (optional)** — one calm, real photo (the car, a lesson in
   progress) can sit on the Home page between sections. 16:9, ~1600px wide.
4. **Logo mark (optional)** — the built-in road emblem works, but if you get a real
   logo, send the SVG and I'll place it in the header, footer, and favicon.

Send me any of these and I'll drop them in.
