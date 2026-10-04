import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ANNOUNCEMENT_COLUMNS,
  ARTICLE_COLUMNS,
  MEDIA_COLUMNS,
  type AnnouncementRow,
  type ArticleRow,
  type MediaRow,
} from "./rows";

/**
 * Reads used by the admin panel.
 *
 * Every one of these is a pure function of a client: no React state, no effects,
 * no side effects. That is deliberate, and it is what keeps the panel's components
 * honest under React's rules.
 *
 * The alternative — a `load` callback that both fetches and calls `setState` — is
 * the shape most dashboards reach for first, and it is wrong twice over. It has to
 * be `useCallback`ed and listed as an effect dependency, and calling it from the
 * effect sets state synchronously, which triggers a cascading re-render before the
 * first paint of data has even been requested. Worse, it has no cancellation: a
 * save that resolves after the editor has navigated away writes into a component
 * that no longer exists.
 *
 * So these return data, and the components decide what to do with it — applying
 * results in an effect's `.then()`, guarded by a flag the cleanup function clears.
 */

/** A read that either produced rows or explains why it did not. */
export interface Result<T> {
  rows: T[];
  error: string | null;
}

export async function fetchAnnouncements(
  supabase: SupabaseClient,
): Promise<Result<AnnouncementRow>> {
  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    // Pinned first, then newest. The board sorts client-side anyway; this keeps
    // the fetched order stable enough that the two agree.
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as AnnouncementRow[], error: null };
}

/** An image slot offered in the story form's thumbnail picker. */
export interface SlotOption {
  id: string;
  gallery: string;
  alt: string;
}

export interface StoryResult extends Result<ArticleRow> {
  slots: SlotOption[];
}

export async function fetchStories(
  supabase: SupabaseClient,
): Promise<StoryResult> {
  const [stories, slots] = await Promise.all([
    supabase
      .from("articles")
      .select(ARTICLE_COLUMNS)
      .order("published_at", { ascending: false }),
    supabase
      .from("media_slots")
      .select("id, gallery, alt")
      .order("gallery")
      .order("sort_order"),
  ]);

  if (stories.error) {
    return { rows: [], slots: [], error: stories.error.message };
  }

  return {
    rows: (stories.data ?? []) as ArticleRow[],
    // A failure to list thumbnails is not worth blocking a story edit for; the
    // picker degrades to "no photograph" and every other field stays usable.
    slots: (slots.data ?? []) as SlotOption[],
    error: null,
  };
}

export async function fetchSlots(
  supabase: SupabaseClient,
): Promise<Result<MediaRow>> {
  const { data, error } = await supabase
    .from("media_slots")
    .select(MEDIA_COLUMNS)
    .order("gallery")
    .order("sort_order");

  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as MediaRow[], error: null };
}

/**
 * One row of the `content_status` view.
 *
 * The view is a union of per-entity aggregates — (entity, published, drafts,
 * last_change) — not a single wide row. That shape is the useful one: it carries
 * the draft count and the timestamp of the last change per collection, which is
 * what an editor actually asks after saving something and not seeing it on the
 * site yet.
 */
export interface StatusRow {
  entity: string;
  published: number;
  drafts: number;
  last_change: string | null;
}

export async function fetchStatus(
  supabase: SupabaseClient,
): Promise<{ rows: StatusRow[]; error: string | null }> {
  const { data, error } = await supabase.from("content_status").select("*");

  if (error) return { rows: [], error: error.message };
  // count() comes back as a JSON number, so these need no coercion.
  return { rows: (data ?? []) as StatusRow[], error: null };
}