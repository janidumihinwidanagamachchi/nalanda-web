import type { Announcement } from "@/data/announcements";
import type { MediaSlot } from "@/data/media";

import type { AnnouncementRow, ArticleRow, MediaRow } from "./rows";

/**
 * Row → domain translation.
 *
 * Isomorphic on purpose: the build-time reader and the admin panel both need
 * these, and neither direction of that dependency involves a secret or a
 * session. Keeping them out of `@/lib/content` means a client component can
 * share them without reaching for the build-time reader, which is the import
 * `scripts/verify.mjs` refuses.
 */

const asCategory = (value: string): Announcement["category"] =>
  value as Announcement["category"];

const asSeverity = (value: string): Announcement["severity"] =>
  value as Announcement["severity"];

/**
 * Attachments are jsonb, so nothing but this enforces the shape.
 *
 * A malformed entry is dropped rather than passed on: `attachment.href` is
 * rendered straight into an anchor, and `undefined` there is a broken link on a
 * deadline notice rather than a type error.
 */
export function toAttachments(value: unknown): Announcement["attachments"] {
  if (!Array.isArray(value)) return undefined;
  const rows = value.filter(
    (entry): entry is { label: string; href: string } =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as { label?: unknown }).label === "string" &&
      typeof (entry as { href?: unknown }).href === "string",
  );
  return rows.length > 0 ? rows : undefined;
}

export function toAnnouncement(row: AnnouncementRow): Announcement {
  const attachments = toAttachments(row.attachments);
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: asCategory(row.category),
    severity: asSeverity(row.severity),
    publishedAt: row.published_at ?? "",
    ...(row.expires_at ? { expiresAt: row.expires_at } : {}),
    ...(row.pinned ? { pinned: true } : {}),
    ...(attachments ? { attachments } : {}),
  };
}

export function toArticle(row: ArticleRow) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body ?? [],
    category: row.category as "Achievements" | "School News",
    publishedAt: row.published_at ?? "",
    readMinutes: row.read_minutes ?? 2,
  };
}

/**
 * Provenance is only attached when all four fields are present.
 *
 * The credits page narrows on `slot.source` and then reads `.author`, `.license`
 * and `.page` with no further guard, so a half-populated source would crash a
 * public page. The database constrains this too; this is the second lock on the
 * same door.
 */
export function toMedia(row: MediaRow): MediaSlot {
  const hasSource =
    row.source_author &&
    row.source_license &&
    row.source_license_url &&
    row.source_page;

  return {
    id: row.id,
    src: row.src,
    alt: row.alt,
    width: row.width,
    height: row.height,
    credit: row.credit ?? "",
    placeholder: row.placeholder,
    ...(row.plate ? { plate: row.plate } : {}),
    ...(hasSource
      ? {
          source: {
            author: row.source_author as string,
            license: row.source_license as string,
            licenseUrl: row.source_license_url as string,
            page: row.source_page as string,
          },
        }
      : {}),
  };
}