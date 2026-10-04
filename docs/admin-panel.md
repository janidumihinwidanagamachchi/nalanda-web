# Content administration

How to attach a Supabase project to this site, apply the schema, and let the
college edit announcements, news and photographs at `/admin`.

The site works without any of this. `src/data` is the content of record for a
build that has no database attached, and that is deliberate: a fork, a preview
branch, or a contributor without access to the project still produces the entire
site. Everything below is additive.

---

## How it fits together

The site is a static export. There is no server, so there is nowhere for a
database query to happen at request time. Reads happen during `next build`, in
Node, and the result is written into HTML files.

```
  editor saves in /admin
        │
        ▼
  Postgres row  ──database webhook──▶  GitHub repository_dispatch
        │                                        │
        │                                        ▼
        │                                  next build (in CI)
        │                                        │
        ▼                                        ▼
  anon key + RLS  ──build-time read──▶  out/*.html  ──▶  GitHub Pages
```

Three consequences worth understanding before changing any of it:

1. **An edit is not live until the rebuild finishes.** Usually one to two
   minutes. `/admin` says so on the overview page rather than letting an editor
   assume otherwise.
2. **Nothing is filtered in application code.** A draft is hidden by a database
   policy, not by a `WHERE published = true` the site remembered to write. The
   panel's own reads go through the same policies.
3. **Deleting an article deletes its page.** There are no redirects on a static
   host, so the panel says this in the confirmation rather than after the fact.

---

## Setup

### 1. Create the project

At [supabase.com](https://supabase.com), create a project. Note the project URL
and the **anon / publishable** key from *Settings → API*.

The anon key is designed to be public — it is the key every visitor's browser
holds. What it can do is bounded entirely by the row-level security policies in
the migration. This project uses **no service-role key at all**, and
`npm run verify` fails the build if one appears in the source or in
`.env.example`.

### 2. Apply the schema

Either paste `supabase/migrations/20260101000100_content_schema.sql` into the
*SQL editor* in the dashboard, or, with the Supabase CLI linked to the project:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

This creates four tables — `admins`, `announcements`, `articles`,
`media_slots` — with their policies, an `updated_at` trigger on each, the public
`site-media` storage bucket, and a `content_status` view the overview page reads.

### 3. Load the current content

The seed is generated from the site's own data files, so the database starts in
exactly the state `src/data` describes:

```bash
npm run seed
```

Then run it in the dashboard's SQL editor, or with
`supabase db reset` locally.

`npm run seed` regenerates `supabase/seed.sql` from `src/data/*.ts`. Run it
whenever those files change and the database should follow.

> Once editors are working in the panel, re-running the seed is still safe: each
> upsert is guarded by `where updated_at = created_at`, so a row the panel has
> touched since it was seeded is left alone. The trade is that a change you make to
> a seeded row in `src/data` will *not* propagate to a row an editor has already
> changed — refresh those with `supabase db reset` locally, or edit them in the
> panel where the change is deliberate.

### 4. Point the site at it

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>
CONTENT_SOURCE=static
```

Leave `CONTENT_SOURCE=static` while working locally. It makes the dev server use
`src/data` with no network calls, which is faster and works offline. Set it to
`supabase` to develop against the live database.

`NEXT_PUBLIC_*` values are **inlined into the bundle at build time**. Adding them
to `.env.local` after `next dev` has started requires a restart, and on CI they
must be present in the build job, not just on Pages.

### 5. Grant yourself access

1. *Authentication → Users → Add user*. Use email and password, and turn off
   "Auto Confirm User" only if you want to confirm by hand.
2. *Authentication → Providers → Email*: **disable "Enable signups"**. The panel
   has no sign-up form, but the endpoint is public, and this panel is
   invite-only by design.
3. Insert your own row:

```sql
insert into public.admins (user_id, email, role)
select id, email, 'editor' from auth.users where email = 'you@example.com';
```

An account with no row in `admins` can sign in successfully and then be told it
is not on the editors list. That is the intended behaviour: authentication and
authorisation are separate questions, and only the second one is this site's to
answer.

### 6. Add the rebuild webhook

An edit saves to Postgres and then nothing happens until someone deploys. The
webhook closes that gap.

**In Supabase** — *Database → Webhooks → Create webhook*:

| | |
|---|---|
| Name | `content-changed` |
| Table | `announcements`, `articles`, `media_slots` |
| Events | `INSERT`, `UPDATE`, `DELETE` |
| Type | HTTP Request |
| URL | `https://api.github.com/repos/janidumihinwidanagamachchi/nalanda-web/dispatches` |
| Method | `POST` |
| Header | `Authorization: Bearer <fine-grained PAT>` |
| Content type | `application/json` |
| Body | `{"event_type": "content-changed"}` |

The workflow at `.github/workflows/pages.yml` already accepts
`repository_dispatch` for that event type; nothing is needed on the GitHub side
beyond the token.

**The token** is the part to be careful with. It needs write access to
*Contents* on this one repository and nothing else — a fine-grained PAT scoped to
a single repo, not a classic `repo` token. Store it in Supabase's webhook header,
not in this repository. Anyone holding it can trigger a deploy; nobody holding
it can read the database.

Verify it end to end by editing a draft notice's title in the panel and watching
the Actions tab. If nothing fires, check the webhook's response in Supabase: a
401 means the token is wrong or lacks Contents access, which is the usual cause.

### 7. Configure CI

Add two repository secrets under *Settings → Secrets and variables → Actions*:

| Secret | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | The project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The publishable key |

With these set, the workflow builds the public site from the database. Without
them it falls back to `src/data` and `/admin` renders its setup instructions —
deliberately, so a fork without secrets still deploys rather than failing.

---

## Local development

```bash
npm run dev      # http://localhost:3000/nalanda-web/admin
```

With `CONTENT_SOURCE=static`, the public pages use `src/data` and `/admin` talks
to the real database. That combination is the useful one: edit a notice in the
panel, watch the *database* change, and see the public site only after a
`CONTENT_SOURCE=supabase` build.

Regenerating seed SQL after editing `src/data`:

```bash
npm run seed
```

---

## What the panel will not let you do

These are deliberate, and each one is a consequence of the static host rather than
a missing feature:

- **Rename an announcement or a story once it exists.** The identifier is the
  primary key. For an article it is also the URL, and `generateStaticParams`
  writes one `out/news/<slug>/index.html` per story — renaming would break every
  link already shared, with no redirect available. Both forms show the
  identifier read-only while editing and say why.
- **Upload a photograph without its provenance.** The database enforces this
  with a check constraint: anything not marked as a placeholder needs an author, a
  licence, a licence URL and an original file. The form asks for all four, rather
  than letting the write fail.
- **Clear the placeholder flag by accident.** It is a checkbox that is ticked by
  default and stays ticked until a human unticks it. A frame that silently claimed
  to be a real photograph when it is a seeded stand-in would be a false statement
  on a site that is otherwise careful about sourcing.
- **Upload an image without reading its dimensions.** Width and height are read
  from the file. Every consumer passes them to `next/image`, and with
  `images.unoptimized` there is no server to correct a wrong value at runtime.

---

## Security, briefly

| Concern | Where it is handled |
|---|---|
| Can a visitor read a draft? | No. The public read policies require `published = true`; the anon key cannot see past it |
| Can a signed-in non-editor write? | No. Write policies require a row in `admins`, via the `is_admin()` function |
| Can the panel create or promote an editor? | No. `admins` has no insert or update policy, and no UI for either. Those rows are granted by hand, in SQL, by someone with dashboard access |
| Can the panel reset someone's password? | No. Supabase's own password recovery applies |
| Is the anon key dangerous in the bundle? | It is designed to be in the bundle. Its power is entirely the policies above |
| Could a service-role key leak? | There is none, and `npm run verify`'s *Admin boundary* stage fails if one appears in `src/` or `.env.example` |
| Is `/admin` in search results? | No. Every admin route carries `noindex`, and the sitemap omits them. The real protection is the policies |

---

## What `npm run verify` checks here

Two gates exist for this subsystem, on top of the build, lint, route walk and
link check:

- **Route walk** fetches `/admin`, `/admin/announcements`, `/admin/news` and
  `/admin/media`, asserts each returns 200, identifies itself, and carries a
  `noindex` robots tag.
- **Admin boundary** asserts that no `"use client"` module imports
  `@/lib/content` — that module reads the database at *build* time, and pulling it
  into the browser would resolve those promises under RLS in the visitor's
  client, which is both wrong and unrenderable — and that no service-role key
  exists anywhere in the source.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `/admin` shows "The panel is not configured" | `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` was absent at build time. They are inlined, so a late edit to `.env.local` needs a restart |
| "Not on the editors list" after a successful sign-in | The account has no row in `admins`. Sign in works; authorisation is a separate check |
| An insert fails with a permission error | The signed-in account is not in `admins`, or the row violates a policy |
| A draft is visible on the site | `CONTENT_SOURCE` is `supabase` but the migration's policies were not applied — the public read policy is what hides it |
| A save succeeds but the site does not change | The webhook did not fire, or CI is building from `src/data` because the secrets are missing. Check the Actions tab and the webhook's response in Supabase |
| An uploaded photograph 404s | The bucket is not public, or the file was written to a path the policy does not allow. Both are set in the migration |
| Photographs do not render after upload | A new project hostname is not in `images.remotePatterns`. `**.supabase.co` is already allowed in `next.config.ts`; a custom domain needs adding |
| An article was deleted and its URL is now 404 | Expected. A static host has no redirects; re-create the story with the same slug to bring the page back |