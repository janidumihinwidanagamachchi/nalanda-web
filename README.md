# Nalanda College, Colombo

A site for Nalanda College, Colombo, built with Next.js 16 and Tailwind v4, and
edited by the college through a Supabase-backed `/admin` panel.

```bash
npm install
npm run dev
```

| | |
|---|---|
| Dev server | `http://localhost:3000` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Full gate | `npm run verify` |
| Content panel | `/admin` — see [`docs/admin-panel.md`](docs/admin-panel.md) |

---

## What this site is

22 routes covering the college's public face: about, history, past principals,
academics, admissions, announcements, news, extra-curricular, community and the
secondary set (downloads, gallery, calendar, alumni, campus, newsletter,
contact, channels).

### Where the content came from

Nothing here was invented to fill a gap. Every factual claim traces to one of:

- the official site `nalandacollege.lk` (motto, vision, mission, societies, past principals, news)
- Ministry Circulars 25/2026 and 09/2026 (admissions rules, seat allocation, deadlines)
- the national school census figures (enrolment, zone, division, address)
- published reporting (founding story, centenary project milestones)

### Where the gaps are, and why they are still gaps

| Gap | Why it is not filled |
|---|---|
| Clubs page | The college publishes one and it is currently empty |
| Principals before 1969 | The published list starts at 1969 |
| Distinguished alumni roll | Never published; a living institution deserves better than a generated list |
| Newsletter archive | Hosted as a shared document with no stable public URL |
| Map embed | A school location is sensitive; left for the school to decide |

Each of these is labelled on the page itself, not hidden.

---

## Link verification

`npm run check-links` checks the tier A links only.

**Tier A** was requested directly and returned a live response.

**Tier B** cannot be machine-checked, and this is not a workaround: Facebook
returns HTTP 200 for a page that does not exist, and Instagram returns
`og:title = "Instagram"` for any handle. Those 22 links are included as supplied
and are marked in the UI. They need a human to confirm them.

Entries that were **corrected or removed during verification**:

| Entry | Reason |
|---|---|
| `youtube.com/@NalandaCollegeCommunicationUnit` | 404. Replaced with the channel ID linked from the official site's own footer |
| `ncst.nalandacollege.lk` | No DNS record |
| `nccs.nalandacollege.lk` | No DNS record |
| `ncastronomy.com` | No DNS record |
| `youtube.com/@nalandacentenaryproject` | 404 |
| `linkedin.com/school/nalandacollegecolombo` | Unreachable. Replaced with `/company/nalandacollegecolombo` |
| `facebook.com/Nalanda100lk` | Independent sources point to `nalandacentenaryproject` |

---

## Motion

There is no JavaScript animation library. Motion, GSAP and Lenis were all removed:
none of them can survive a static export without a hydration cost, and on a site
this size the same result is cheaper in CSS. Every affordance here — hover, focus,
disclosure, the gallery lightbox, the mobile drawer — is a CSS transition or a
`details` element. `npm run verify` fails if any of those packages reappear, so the
decision cannot quietly reverse.

Rules the build holds to:

- `transform` and `opacity` only. Never `width`, `height`, `margin`, `top` or `left`.
- No `scale(0)` on an entrance. Entrances start slightly under full size.
- `ease-in` is never used on UI. Entrances and exits use `ease-out`.
- UI durations stay under 300ms, and read from a token rather than a literal.
- Hover effects are gated behind `@media (hover: hover) and (pointer: fine)`, so a
  tap on a touch device does not leave an effect stuck on.
- **Everything honours `prefers-reduced-motion`.**
- Nothing hijacks scroll. The page scrolls the way the reader expects.

### Reading the source

| File | Purpose |
|---|---|
| `src/app/globals.css` | The tokens every transition reads: `--motion-fast`, `--motion-uniform`, `--motion-slow` |
| `src/components/ui/` | The primitives pages are built from, each carrying its own transitions |

---

## Content administration

Announcements, news and photographs are held in Supabase and edited by the
college at `/admin`. Everything else on the site — history, principals,
academics, admissions, the gaps and caveats — stays in version control as
TypeScript, because those are not facts that change between one secretary's
tenure and the next.

The awkward part is that the site is a static export with no server. It is
resolved like this:

| | |
|---|---|
| Reading the database | At **build time**, in Node, using the anon key under RLS. Every article becomes its own prerendered HTML file, so search engines and link previews work exactly as before |
| Showing the visitor a draft | Never. A row with `published = false` is refused by the database policy itself, so it cannot leak through a query the site did not think to filter |
| Publishing an edit | The save triggers a **GitHub `repository_dispatch`**, which reruns the deploy. The change is live after the rebuild finishes |
| Signing in | Supabase email and password. Accounts are created in the Supabase dashboard; the panel cannot create them |
| Authorisation | A row in the `admins` table. It has no insert policy, so nothing running in a browser can grant itself access |
| Photographs | Supabase Storage, public bucket, admin-only writes |

There is no service-role key anywhere in this project, and `npm run verify` fails
if one appears. On a static site every `NEXT_PUBLIC_` value is published in the
bundle; a service-role key would not be a leak to be noticed later but a leak
already in production.

The site also builds with no Supabase environment at all, using the content in
`src/data` as its fallback — so a fork, a preview build, and a contributor with
no access to the database all still produce the whole site.

Full setup, including the schema, the webhook, and granting a colleague access:
**[`docs/admin-panel.md`](docs/admin-panel.md)**.

---

## Audits

### Motion review

Run when the animation libraries were removed, against `review-animations`. The
work was subtractive: everything a library was doing is now done in CSS, so the
findings were about what to delete and what to keep.

| Before | After | Why |
| --- | --- | --- |
| GSAP pinned stack and horizontal pan on `/history` and `/extra-curricular/clubs` | Static layout with CSS transitions | A pinned scroll sequence needs JS on every frame; on a static export that is hydration cost for an effect nobody required |
| Lenis smooth scroll | Native scroll | Hijacking scroll fights the reader and breaks `prefers-reduced-motion` |
| `magnetic-button` driving `x` / `y` shorthands | Hover nudges via a CSS `translate` | The shorthands were never hardware-accelerated here |
| `whileHover` scale on cards and tiles, ungated | Gated behind `(hover: hover) and (pointer: fine)` | Touch devices emulate hover, so the effect fired on tap |

Confirmed: no `transition: all`, no `scale(0)`, no `ease-in` on UI, no animation
of layout properties, no scroll listener, and no animation dependency in
`package.json`.

### Web interface guidelines

Run against the Vercel Web Interface Guidelines. Findings, all fixed:

- News and announcement filters held state in `useState` and could not be shared.
  Both now sync to a `?category=` query parameter via `useUrlFilter`, wrapped in
  `Suspense` so static generation survives.
- No `touch-action: manipulation` on interactive elements. Added in the base layer.
- No `-webkit-tap-highlight-color`. Added, tinted from the accent.
- Gallery lightbox had no `overscroll-behavior: contain`. Added.
- Mobile drawer ignored safe-area insets. Added.
- No route-level error boundary or loading skeleton. Added `error.tsx`,
  `loading.tsx`, `GridSkeleton` and `ListSkeleton`.
- Number columns were not using tabular figures. Applied globally to `p` and `dd`.

Still worth a human eye:

- Headings use sentence case, not the Title Case the guidelines suggest. This is
  a deliberate editorial choice for a heritage institution.
- Light and dark mode have not been reviewed side by side in a browser.

---

## Known issues

Kept visible rather than quietly fixed.

1. **Eleven of the photographs are still placeholders.** 11 slots across the
   hero, gallery and campus use seeded `picsum.photos` images, listed in
   `src/data/media.ts`. This is the single largest gap between this and a site
   that looks finished. A centenary school site is carried by its archive, and the
   archive is not online. `/credits` names every one of them, and the site labels
   them as placeholders wherever they appear — the `/admin` panel makes replacing
   them a matter of uploading a file and supplying its provenance.

2. **The YouTube channel appears inactive.** The verified channel's public RSS
   feed returns uploads with a latest date in 2021. `/channels` renders the six
   most recent and says plainly that the list is not current. Worth confirming
   which channel the college intends to publish to.

3. **Two tier A links are WAF-blocked, not dead.** `njoba.lk` and `nalanda100.lk`
   return 403 to the link checker. A 403 is a firewall answering a bot, not
   evidence a page is gone; both were reachable in a browser. The checker reports
   them as `blocked` and exits 0.

4. **Light and dark mode have not been visually reviewed in both themes.** The
   CSS was verified by computed style (`--surface` resolves to `#fbfaf9` in light,
   `#14100f` in dark) but the screenshot harness would not apply a colour scheme
   override, so no side-by-side visual pass has been done. This is a tooling gap,
   not a known styling fault.

5. **The dark-mode accent reads as rose rather than maroon.** The dark palette
   uses `#dd7d92` so that a filled button keeps contrast against a near-black
   surface. It is legible but drifts from the maroon identity. Worth a decision.

6. **The crest has a white background.** It is mounted on a light circular chip
   so it reads correctly on the dark theme too. It will look slightly raised
   rather than printed.

7. **School hours are omitted.** Sources conflict (07:10–13:10 against
   07:30–13:30) so the figure is not published anywhere on the site.

8. **The college song title is omitted.** It appears in exactly one secondary
   source, unverified.

9. **`/channels` embeds Instagram and Facebook as link cards.** Both need
   platform credentials and App Review. See `.env.example`. No credential means
   a designed card, never an empty frame.

10. **Admission figures follow the circulars, not a live vacancy count.** The
    published vacancy position for the current year is not asserted anywhere.

---

## Content still owed by the school

Listed in `NEEDS_SUPPLY` in `src/data/site.ts`, and shown to visitors on
`/academics`:

- school start and finish times
- subject combinations offered in Grades 11 to 13
- O/L and A/L results by year
- staff directory
- timetable
- uniform specification
- fee, canteen and transport schedules
- the principal's photograph and welcome message
- archival photography

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 ·
Supabase (Postgres, Auth and Storage) · no animation dependencies

Type is Newsreader for display and Geist for UI. The palette is the college's own
maroon and silver, defined once in CSS custom properties and locked across both
themes.