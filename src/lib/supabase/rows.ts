/**
 * Database row shapes and the column lists that fetch them.
 *
 * Shared by the build-time reader (`@/lib/content`) and the admin panel, so a
 * column rename breaks in one place rather than two. These types describe what
 * Postgres returns, not what the site renders — the mappers in `./mappers` do
 * that translation.
 *
 * Note the date fields are `date` columns and arrive as 'YYYY-MM-DD' strings,
 * which is already the format the components format in UTC.
 */

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  category: string;
  severity: string;
  published_at: string | null;
  expires_at: string | null;
  pinned: boolean;
  attachments: unknown;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  slug: string;
  title: string;
  excerpt: string;
  body: string[] | null;
  category: string;
  published_at: string | null;
  read_minutes: number | null;
  hero_slot_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaRow {
  id: string;
  gallery: string;
  src: string;
  storage_path: string | null;
  alt: string;
  width: number;
  height: number;
  credit: string | null;
  placeholder: boolean;
  plate: string | null;
  source_author: string | null;
  source_license: string | null;
  source_license_url: string | null;
  source_page: string | null;
  on_home: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const ANNOUNCEMENT_COLUMNS =
  "id, title, body, category, severity, published_at, expires_at, pinned, attachments, published, created_at, updated_at";

export const ARTICLE_COLUMNS =
  "slug, title, excerpt, body, category, published_at, read_minutes, hero_slot_id, published, created_at, updated_at";

export const MEDIA_COLUMNS =
  "id, gallery, src, storage_path, alt, width, height, credit, placeholder, plate, source_author, source_license, source_license_url, source_page, on_home, sort_order, published, created_at, updated_at";

/** The bucket admin uploads land in. Must match supabase/migrations. */
export const MEDIA_BUCKET = "site-media";