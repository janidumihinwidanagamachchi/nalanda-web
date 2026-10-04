-- Nalanda College content schema.
--
-- Scope is deliberately narrow: announcements, news articles and the media
-- slots behind the hero, gallery, campus and news thumbnails. Those are the
-- three areas the college changes week to week. Everything else — history,
-- principals, societies, admissions rules — is reference material that is
-- corrected rather than rewritten, and it stays in src/data until there is a
-- reason to move it.
--
-- Identity mirrors the TypeScript domain one to one, on purpose:
--   announcements.id  <-> Announcement.id   (slug, e.g. 'g1-2027-applications')
--   articles.slug     <-> Article.slug     (URL segment)
--   media_slots.id    <-> MediaSlot.id      (e.g. 'malalasekara-hall')
-- Because the keys are the same strings the components already use, moving a
-- table to the database does not change a single component's types, and the
-- existing verify gates keep asserting against real content.
--
-- Dates are `date`, not `timestamptz`. Every date on this site is a calendar
-- date with no time component ('2026-07-30'), and the components format them in
-- UTC. A timestamp would make 'expires 30 July' mean an instant, and a notice
-- would then expire at a different wall-clock moment depending on where the
-- build ran.

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------

-- Membership is granted by hand, in the Supabase dashboard or by SQL, never
-- from the browser. There is deliberately no INSERT policy: an admin panel that
-- can hand out admin rights is an admin panel that can be locked out of.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'editor' check (role in ('editor', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A signed-in user may read their own row. The admin panel uses this to decide
-- whether to show "not authorised" or the panel itself.
create policy "admins read own row"
  on public.admins for select
  using (user_id = (select auth.uid()));

-- SECURITY DEFINER because the policy on admins would otherwise recurse into
-- itself when is_admin() reads the table. search_path is pinned so a hostile
-- schema cannot shadow it.
create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
  as $$
    select exists (
      select 1 from public.admins where user_id = (select auth.uid())
    );
  $$;

-- ---------------------------------------------------------------------------
-- Announcements
-- ---------------------------------------------------------------------------

create table public.announcements (
  id text primary key,
  title text not null check (length(btrim(title)) > 0),
  body text not null check (length(btrim(body)) > 0),
  category text not null check (
    category in ('Admissions', 'Examinations', 'Circulars', 'Events', 'General')
  ),
  severity text not null default 'info' check (
    severity in ('info', 'important', 'urgent')
  ),
  published_at date not null default current_date,
  expires_at date,
  pinned boolean not null default false,
  -- [{ "label": "...", "href": "..." }]. Kept as jsonb rather than a child
  -- table because it is read and written whole and never queried across rows.
  attachments jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A notice with an expiry date in the past is still a real record, so this is
  -- a consistency check rather than a lifecycle rule.
  constraint expires_after_published check (
    expires_at is null or expires_at >= published_at
  )
);

create index announcements_published_at_idx
  on public.announcements (published, published_at desc);

alter table public.announcements enable row level security;

-- The build fetches as an anonymous visitor, so "published" is doing real work
-- here: an unpublished draft must not be reachable by guessing a URL or by
-- reading the table directly.
create policy "public read published announcements"
  on public.announcements for select
  using (published = true);

create policy "admins manage announcements"
  on public.announcements for all
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- News articles
-- ---------------------------------------------------------------------------

create table public.articles (
  -- The URL segment. Changing it changes the published URL, which is why the
  -- admin panel treats it as editable but warns about it.
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(btrim(title)) > 0),
  excerpt text not null check (length(btrim(excerpt)) > 0),
  -- One array element per paragraph, matching Article.body: string[] exactly.
  body text[] not null default '{}',
  category text not null check (category in ('Achievements', 'School News')),
  published_at date not null default current_date,
  read_minutes int not null default 2 check (read_minutes between 1 and 60),
  -- Set when an editor attaches a photograph to the story. Resolved into a
  -- MediaSlot at build time; a dangling id simply falls back to the seeded
  -- placeholder, so a deleted photo cannot break the news index. The foreign key
  -- is added below, once media_slots exists.
  hero_slot_id text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_published_at_idx
  on public.articles (published, published_at desc);

alter table public.articles enable row level security;

create policy "public read published articles"
  on public.articles for select
  using (published = true);

create policy "admins manage articles"
  on public.articles for all
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Media slots
-- ---------------------------------------------------------------------------

-- Which collection a slot belongs to. 'hero' holds exactly one row; 'gallery'
-- and 'campus' are ordered by sort_order; 'news' is keyed by article slug and
-- supplies the story thumbnail.
create table public.media_slots (
  id text primary key,
  gallery text not null check (
    gallery in ('hero', 'gallery', 'campus', 'news')
  ),
  -- Either a repository path under /public or an absolute URL (a Supabase
  -- Storage public URL, or a licensed file hosted elsewhere). Resolution
  -- happens in the admin panel; the build takes this column as given.
  src text not null check (length(btrim(src)) > 0),
  -- Set when the file lives in the media bucket, so the panel can offer
  -- "remove from storage" and so a rebuild can tell what it owns.
  storage_path text,
  alt text not null check (length(btrim(alt)) > 0),
  width int not null check (width > 0),
  height int not null check (height > 0),
  credit text not null default '',
  -- Honest flag, and it is load-bearing: the gallery and the credits page both
  -- label placeholder frames, so this must be cleared by hand when a real
  -- photograph arrives rather than inferred from the absence of a licence.
  placeholder boolean not null default true,
  -- Ledger plate number, for the frames that carry one.
  plate text,
  -- Provenance for a photograph the college does not own. Required by the
  -- credits page, so it is four columns rather than one blob of text.
  source_author text,
  source_license text,
  source_license_url text,
  source_page text,
  -- Shown in the home page photograph band.
  on_home boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A photograph the site does not own must say who owns it. This is the rule
  -- the existing credits page already enforces by hand.
  constraint provenance_is_complete check (
    placeholder
    or source_author is null
    or (
      source_license is not null
      and source_license_url is not null
      and source_page is not null
    )
  )
);

create index media_slots_gallery_idx
  on public.media_slots (gallery, sort_order);

alter table public.media_slots enable row level security;

create policy "public read published media"
  on public.media_slots for select
  using (published = true);

create policy "admins manage media"
  on public.media_slots for all
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- media_slots is created after articles so this lives here rather than inline,
-- where it would be a forward reference to a table that does not exist yet.
alter table public.articles
  add constraint articles_hero_slot_fk
  foreign key (hero_slot_id) references public.media_slots (id) on delete set null;

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
  returns trigger
  language plpgsql
  as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$;

create trigger announcements_touch
  before update on public.announcements
  for each row execute function public.touch_updated_at();

create trigger articles_touch
  before update on public.articles
  for each row execute function public.touch_updated_at();

create trigger media_slots_touch
  before update on public.media_slots
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

-- Public bucket: photographs are served to visitors from a CDN URL, exactly as
-- the /public files are today. Only the media bucket is public; nothing else in
-- the project is exposed by default.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "public read site media"
  on storage.objects for select
  using (bucket_id = 'site-media');

create policy "admins upload site media"
  on storage.objects for insert
  with check (bucket_id = 'site-media' and (select public.is_admin()));

create policy "admins update site media"
  on storage.objects for update
  using (bucket_id = 'site-media' and (select public.is_admin()))
  with check (bucket_id = 'site-media' and (select public.is_admin()));

create policy "admins delete site media"
  on storage.objects for delete
  using (bucket_id = 'site-media' and (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Publishing
-- ---------------------------------------------------------------------------

-- A rebuild is what makes an edit visible, so the panel says so rather than
-- implying the live site changed. This view is what a webhook or a scheduled
-- query would poll if the project ever wants a "last published at" badge
-- without reading application logs.
create or replace view public.content_status
with (security_invoker = true) as
  select 'announcements' as entity,
         count(*) filter (where published) as published,
         count(*) filter (where not published) as drafts,
         max(updated_at) as last_change
  from public.announcements
  union all
  select 'articles', count(*) filter (where published), count(*) filter (where not published), max(updated_at)
  from public.articles
  union all
  select 'media_slots', count(*) filter (where published), count(*) filter (where not published), max(updated_at)
  from public.media_slots;