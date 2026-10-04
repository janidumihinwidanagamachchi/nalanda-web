/**
 * Slug generation for new records.
 *
 * Both `announcements.id` and `articles.slug` are text primary keys that mirror
 * a slug, and `articles.slug` has a database check constraining it to
 * lowercase-hyphenated form. Generating them here means the panel never has to
 * ask an editor to invent an identifier by hand, and never produces one the
 * database will reject.
 *
 * Deliberately not a dependency. This is thirty lines, and a slug library would
 * be the project's only runtime dependency that exists for the admin panel
 * alone.
 */

const DIACRITICS = /[\u0300-\u036f]/g;

/** Lowercase, hyphen-separated, ASCII only — matching the SQL check constraint. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Makes a slug unique against the ids already in use.
 *
 * Appends `-2`, `-3` and so on. Only used when creating a record; an existing id
 * is never rewritten, because `articles.slug` is a live URL segment.
 */
export function uniqueSlug(base: string, taken: readonly string[]): string {
  const root = slugify(base) || "untitled";
  if (!taken.includes(root)) return root;

  for (let n = 2; n < 500; n += 1) {
    const candidate = `${root}-${n}`;
    if (!taken.includes(candidate)) return candidate;
  }

  // Unreachable in practice; a collision at 500 would mean something is wrong
  // that a suffix cannot fix.
  return `${root}-${Date.now()}`;
}