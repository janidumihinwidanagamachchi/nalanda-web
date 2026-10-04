import {
  ALL_MEDIA,
  AWAITING_SLOTS,
  CAMPUS_SLOTS,
  GALLERY_SLOTS,
  HERO_MEDIA,
  HOME_PHOTOS,
  thumbFor,
  type MediaSlot,
} from "@/data/media";
import { ANNOUNCEMENTS, type Announcement } from "@/data/announcements";
import { ARTICLES, type ResolvedArticle } from "@/data/news";

import { toAnnouncement, toArticle, toMedia } from "@/lib/supabase/mappers";
import {
  ANNOUNCEMENT_COLUMNS,
  ARTICLE_COLUMNS,
  MEDIA_COLUMNS,
  type AnnouncementRow,
  type ArticleRow,
  type MediaRow,
} from "@/lib/supabase/rows";

import { buildClient, readsSupabase } from "./client";

/**
 * The one place the site decides where its content comes from.
 *
 * Everything above this module keeps importing plain arrays from src/data, and
 * everything below it knows about Postgres. That boundary is the whole point: it
 * means moving a table into the database does not ripple into components, and it
 * means the site still builds with no database at all.
 *
 * Two sources, chosen by CONTENT_SOURCE:
 *
 *   static     (default) src/data is the content. Zero configuration, which is
 *              what local development and a first `git clone` want.
 *   supabase   CONTENT_SOURCE=supabase. The build reads the database as an
 *              anonymous visitor. CI sets this, so production content comes from
 *              the panel.
 *
 * The failure behaviour differs between them, deliberately. A static build has
 * nothing to fail. A Supabase build throws: if the database is unreachable, or
 * RLS is misconfigured, or a column was renamed, the deploy stops. Falling back
 * quietly would be the worst outcome available here, because the rebuild would
 * appear to succeed while quietly publishing last month's content.
 */

/** The media collections the site reads, mirroring the src/data exports. */
export interface MediaLibrary {
  hero: MediaSlot;
  gallery: MediaSlot[];
  campus: MediaSlot[];
  home: MediaSlot[];
  all: MediaSlot[];
  awaiting: MediaSlot[];
}
// ---------------------------------------------------------------------------
// Static source
// ---------------------------------------------------------------------------

/**
 * The seeded news thumbnail, expressed as a MediaSlot.
 *
 * Wrapping `thumbFor()` rather than leaving components to call it means a card
 * reads `article.thumb.src` in both modes, and the seeded placeholder keeps
 * working for any story that has no uploaded photograph.
 *
 * `alt` is empty on purpose. On a card the headline sits directly beneath the
 * image and says what the picture is for, so the image is decorative and
 * announcing a caption as well would read the same sentence twice.
 */
const seededThumb = (slug: string): MediaSlot => ({
  id: `news-${slug}`,
  src: thumbFor(),
  alt: "",
  width: 1200,
  height: 800,
  credit: "",
  placeholder: true,
});

// ---------------------------------------------------------------------------
// Public reads
//
// Each is memoised on its promise. A build asks for the articles at least three
// times — generateStaticParams, generateMetadata, and the page body — and the
// dashboard asks for everything at once. One query each is plenty.
// ---------------------------------------------------------------------------

let announcementsOnce: Promise<Announcement[]> | null = null;
let articlesOnce: Promise<ResolvedArticle[]> | null = null;
let mediaOnce: Promise<MediaLibrary> | null = null;

export function getAnnouncements(): Promise<Announcement[]> {
  announcementsOnce ??= readAnnouncements();
  return announcementsOnce;
}

export function getArticles(): Promise<ResolvedArticle[]> {
  articlesOnce ??= readArticles();
  return articlesOnce;
}

export function getMedia(): Promise<MediaLibrary> {
  mediaOnce ??= readMedia();
  return mediaOnce;
}

/** Test seam: drops the memo so a second read hits the database again. */
export function resetContentCache(): void {
  announcementsOnce = null;
  articlesOnce = null;
  mediaOnce = null;
}

async function readAnnouncements(): Promise<Announcement[]> {
  if (!readsSupabase()) return ANNOUNCEMENTS;

  const { data, error } = await buildClient()
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("published", true);

  // A thrown error here fails the build. See the module comment: a Supabase
  // build must never fall back to stale content without saying so.
  if (error) throw new Error(`Could not read announcements: ${error.message}`);

  console.log(`[content] ${data.length} published announcements`);
  return (data as AnnouncementRow[]).map(toAnnouncement);
}

async function readArticles(): Promise<ResolvedArticle[]> {
  if (!readsSupabase()) {
    return ARTICLES.map((article) => ({
      ...article,
      thumb: seededThumb(article.slug),
    }));
  }

  const supabase = buildClient();

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("published", true);

  if (error) throw new Error(`Could not read articles: ${error.message}`);

  const rows = data as ArticleRow[];
  const thumbs = await readNewsThumbs();

  console.log(`[content] ${rows.length} published articles`);

  return rows.map((row) => {
    // hero_slot_id wins, then a slot keyed by the story's own slug, then the
    // seeded placeholder. A dangling id resolves to nothing rather than
    // throwing, so deleting a photo cannot break the news index.
    const thumb =
      (row.hero_slot_id ? thumbs.get(row.hero_slot_id) : undefined) ??
      thumbs.get(row.slug) ??
      seededThumb(row.slug);

    return { ...toArticle(row), thumb } as ResolvedArticle;
  });
}

/**
 * News thumbnails, keyed by slot id.
 *
 * Read separately from the rest of the media because it is keyed by article slug
 * rather than ordered for display, and a story needs its thumbnail whether or
 * not the gallery collection exists.
 */
async function readNewsThumbs(): Promise<Map<string, MediaSlot>> {
  const { data, error } = await buildClient()
    .from("media_slots")
    .select(MEDIA_COLUMNS)
    .eq("gallery", "news")
    .eq("published", true);

  if (error) throw new Error(`Could not read news thumbnails: ${error.message}`);

  return new Map(
    (data as MediaRow[]).map((row) => [row.id, { ...toMedia(row), alt: "" }]),
  );
}

async function readMedia(): Promise<MediaLibrary> {
  if (!readsSupabase()) {
    return {
      hero: HERO_MEDIA,
      gallery: GALLERY_SLOTS,
      campus: CAMPUS_SLOTS,
      home: HOME_PHOTOS,
      all: ALL_MEDIA,
      awaiting: AWAITING_SLOTS,
    };
  }

  const { data, error } = await buildClient()
    .from("media_slots")
    .select(MEDIA_COLUMNS)
    .neq("gallery", "news")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Could not read media: ${error.message}`);

  // Grouped on the raw rows so sort_order decides the order inside each
  // collection before it is dropped — MediaSlot does not carry that column.
  const rows = data as MediaRow[];
  const of = (gallery: string) =>
    rows.filter((row) => row.gallery === gallery).map(toMedia);

  const gallery = of("gallery");
  const campus = of("campus");

  // The one place a content gap is tolerated rather than thrown. An empty
  // masthead would take the home page down, and the static hero is a real
  // photograph with a real credit, so the site stays intact while the log says
  // exactly which row is missing.
  const heroRow = of("hero")[0];
  if (!heroRow) {
    console.warn(
      `[content] no row with gallery='hero' in media_slots — falling back to ` +
        `the static hero (${HERO_MEDIA.id}). Insert that row to fix this.`,
    );
  }
  const hero = heroRow ?? HERO_MEDIA;

  // The home band follows the editor's on_home flag, in gallery order.
  let home = rows
    .filter((row) => row.gallery === "gallery" && row.on_home)
    .map(toMedia);

  if (home.length === 0 && gallery.length > 0) {
    // An empty band would leave a heading over nothing. Three real photographs
    // is what the band is composed for, so fall back to those rather than
    // rendering a section with no content in it.
    console.warn(
      "[content] no media slot has on_home set — falling back to the first " +
        "three gallery slots for the home page band.",
    );
    home = gallery.slice(0, 3);
  }

  // Same shape as ALL_MEDIA in src/data: hero, then gallery, then campus. The
  // credits page walks this order.
  const all = [hero, ...gallery, ...campus];

  console.log(
    `[content] ${all.length} media slots (${home.length} on the home page, ` +
      `${all.filter((slot) => slot.placeholder).length} awaiting a photograph)`,
  );

  return {
    hero,
    gallery,
    campus,
    home,
    all,
    awaiting: all.filter((slot) => slot.placeholder),
  };
}