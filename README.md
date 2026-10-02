# Nalanda College, Colombo

A site for Nalanda College, Colombo, built with Next.js 16, Tailwind v4, Motion and GSAP.

```bash
npm install
npm run dev
```

| | |
|---|---|
| Dev server | `http://localhost:3000` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Link check | `npm run check-links` |

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

Motion intensity is high throughout, but every animation earns its place: it
either orients, gives feedback, indicates a state change, or bridges a change
that would otherwise be abrupt.

Rules the build holds to:

- `transform` and `opacity` only. Never `width`, `height`, `margin`, `top` or `left`.
- Never `scale(0)` on an entrance. Entrances start at `scale(0.94)` with opacity.
- `ease-in` is never used on UI. Entrances and exits use `ease-out`.
- UI durations stay under 300ms.
- No `window.addEventListener("scroll")`. Scroll is read through Motion's
  `useScroll` or GSAP ScrollTrigger.
- GSAP work runs inside `useGSAP` with `gsap.context` and is reverted on unmount.
- Scroll and pointer values use `useMotionValue`, never React state.
- **Everything honours `prefers-reduced-motion`.** Loops, parallax, scroll
  hijacks and magnetic hover all collapse to static.

The two heaviest scroll moments are on `/history` (a GSAP pinned sticky-stack
over the founding timeline) and `/extra-curricular/clubs` (a horizontal
scroll pan).

### Reading the source

| File | Purpose |
|---|---|
| `src/constants/motion.ts` | Every easing, duration band, spring and stagger value |
| `src/components/motion/` | The primitives all pages are built from |
| `src/components/motion/sticky-stack.tsx` | GSAP pinned stack and horizontal pan |
| `src/lib/scroll.ts` | ScrollTrigger registration and the Lenis bridge |

---

## Audits

### Motion review

Run against `review-animations`. Three findings, all fixed:

| Before | After | Why |
| --- | --- | --- |
| `magnetic-button.tsx` drove the element with the `x` / `y` shorthands | Composed a single `translateX() translateY()` string via `useTransform` | The shorthands are not hardware-accelerated and drop frames under load |
| `DURATION.modal` was `0.32s` on the gallery lightbox | `0.28s` | UI overlays stay under 300ms |
| `whileHover` scale on news cards and gallery tiles was ungated | Gated behind `(hover: hover) and (pointer: fine)` | Touch devices emulate hover, so the effect fired on tap |

Confirmed clean: no `transition: all`, no `scale(0)`, no `ease-in` on UI, no
animation of layout properties, GSAP work inside `useGSAP` with revert, scroll
read through `useScroll` or ScrollTrigger rather than a window listener.

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

1. **Every image is a placeholder.** 13 slots across the hero, gallery and
   campus use seeded `picsum.photos` images. The slots are all in
   `src/data/media.ts`. This is the single largest gap between this and a site
   that looks finished. A centenary school site is carried by its archive.

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
Motion 14 · GSAP 3 with ScrollTrigger · Lenis · Phosphor Icons

Type is Newsreader for display and Geist for UI. The palette is the college's own
maroon and silver, defined once in CSS custom properties and locked across both
themes.