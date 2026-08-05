# Northland Driving

Website for **Northland Driving** — warm, patient one-on-one driving lessons for
adult women in Gladstone & the Kansas City Northland area. Led by Mary and our team of female drivers. Lessons in English
or Tagalog.

Static multi-page site, no build step. Bilingual (English / Tagalog) via a toggle in the header.

## Files

| File | What it is |
|------|-----------|
| `index.html` | Home |
| `about.html` | Our Drivers / Lead Instructor & Team |
| `pricing.html` | Pricing & Session Packages |
| `permit.html` | Missouri Permit Guide |
| `quiz.html` | Missouri Permit Study Quiz |
| `contact.html` | Book a lesson with our team (email integration) |
| `styles.css` | Shared design system |
| `app.js` | Shared behaviour: navigation, English/Tagalog toggle, FAQ, booking |
| `quiz.js` | Interactive permit practice quiz |

## Pricing Structure

- **1-Hour Focus Session**: $85
- **2-Hour Standard / Test Prep**: $160
- **3-Session Confidence Package (6 Hours)**: $450
- **Pick-up**: Free within Northland area (~10 min radius of Gladstone: Parkville, NKC, Liberty).

## Run it

Open `index.html` in any modern web browser, or serve it properly:

```bash
npm run serve      # http://localhost:8080
```

## Verify it

The site duplicates its header, footer, prices and every translatable string
across six hand-edited pages and two languages. The recurring defect is a
change applied to some of those surfaces but not all of them — and it never
throws, it just quietly says the wrong thing.

```bash
npm run check      # the gate: under a second, no dependencies
npm run verify     # the gate, plus proof the checks still work
```

Eight checks cover link integrity, Tagalog coverage, brand boundaries, price
agreement across pages and JSON-LD, quiz-bank integrity, per-page structure,
nav consistency and font wiring. Node 18+ is the only requirement.

Setup — including the optional browser pass — is in
[`.agent/INSTALL.md`](.agent/INSTALL.md). How it is built and how to extend
it is in [`.agent/HARNESS.md`](.agent/HARNESS.md).
