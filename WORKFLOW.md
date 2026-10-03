# Nalanda College web — workflow

This file is for whoever clones the repo and needs to run, update, or deploy it. For project background, build state, and known content gaps, see `README.md`.

## Requirements

- Node 24.x (`.nvmrc` and `package.json` `engines.node` pin it)
- npm 10+
- `gh` CLI with repo scope, if you will create or manage the GitHub remote
- `agent-browser` is optional; without it the verify gate is weaker

```bash
nvm use 24        # or install Node 24.x
npm install
npm run doctor    # advisory environment check
```

## Clone and verify

```bash
git clone <repo-url>
cd nalanda-web
npm install
npm run verify
```

`verify` runs:

1. Environment checks (Node 24.x, `.env.example` tracked)
2. `next build`
3. `eslint`
4. Route walk on a probed free port: every route must return 200 and contain a page-specific content marker (e.g. `/history` must contain the phrase "From a section of Ananda to a hundred years"); the 404 must return 404
5. `npm run check-links` (tier A only; tier B are hand-checked)
6. Browser console check — **currently disabled**
7. Teardown

A successful run ends with `Finished in …s` and exit 0.

## The gate and its blind spot

The route walk uses **content markers**, not just status codes, because the original `/history` bug passed TypeScript, the build, and every HTTP 200 check while still serving the error boundary at runtime. Content markers catch that class of failure.

The blind spot is **client-side runtime errors that do not change the static HTML**. The verify script has a browser console stage meant to close this, but it is currently disabled: `agent-browser` works from an interactive shell but times out when driven as a child process in this environment. Until that is fixed, manually open `/history` and `/extra-curricular/clubs` in a clean browser after any change that touches `src/lib/scroll.ts`, `src/components/motion/sticky-stack.tsx`, GSAP, Lenis, or React rendering.

## Daily loop

```bash
npm run doctor
npm run verify
```

`doctor` is advisory. Run it before you start to catch stale `.next`, occupied ports, or a dirty tree. `verify` is the gate: do not push if it fails.

## Content updates

All content lives in `src/data/`:

- `site.ts` — site metadata, social URLs, contact, domain
- `history.ts`, `pastPrincipals.ts`, `academics.ts`, `admissions.ts`, `announcements.ts`, `news.ts`, `community.ts`, `channels.ts`, `extraCurricular.ts`, `media.ts`

Edit only those files for text changes. Do not invent facts. If a piece of information is missing from the sources, label the gap on the page rather than filling it in. See `README.md` for the current list of deliberate gaps.

## Images

There are 13 placeholder images seeded from `picsum.photos` in `src/data/media.ts`. Replace them with real Nalanda College photography as assets become available. `next.config.ts` already whitelists `picsum.photos`, `fastly.picsum.photos`, and `i.ytimg.com`. Add new remote hostnames to `next.config.ts` when you add external images.

## Embed credentials

Optional. Copy `.env.example` to `.env.local` and fill in only the credentials you have:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_INSTAGRAM_TOKEN` — Meta app with Instagram Basic Display or Graph API
- `NEXT_PUBLIC_FB_APP_ID` — Meta app for the Page Plugin

When a credential is absent, `/channels` renders designed link cards instead of empty third-party frames. Never commit `.env.local`.

## Vercel deploy

The repo is configured for a static Next.js export or serverless deploy on Vercel. The canonical domain is hardcoded to `https://nalandacollege.lk` in `src/data/site.ts`; preview deployments intentionally emit the same canonical so they do not compete with the live site.

```bash
npm run verify
npm run build
# Deploy via the Vercel dashboard or vercel CLI
```

## Known issues

- Browser console checks in `npm run verify` are disabled (see "The gate and its blind spot").
- 13 placeholder images remain.
- Several content items are blocked on the school: school hours, subject streams for Grades 11–13, O/L and A/L results, staff directory, timetable, uniform, fees, principal's photo.
- Authoritative YouTube channel is unresolved; `/channels` notes the latest upload is 2021.
- Dark-mode accent `#dd7d92` (rose) is a deliberate choice pending your decision on whether to move it toward maroon.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `verify` fails at "Build" | stale `.next` or dependency drift | `rm -rf .next && npm install && npm run build` |
| `verify` fails at "Route walk" | a route returned the error boundary, or a content marker changed | open the failing route in a browser; check `src/app/*/page.tsx` and `src/data/*` |
| `verify` fails at "Link check" | a tier A link is dead | verify by hand in a browser; if the school changed the URL, update `src/data/channels.ts` |
| Ports 3000/3001 busy | another dev/preview server is running | stop the other process, or let `verify` probe a free port automatically |
| `doctor` reports remote missing | repo not created/pushed yet | `gh repo create janidumihinwidanagamachchi/nalanda-web --private --source=. --remote=origin --push` |
| `.env.example` is untracked | `.gitignore` hides all `.env*` files | already fixed in this repo; on a fresh clone, ensure `.gitignore` contains `!.env.example` |
