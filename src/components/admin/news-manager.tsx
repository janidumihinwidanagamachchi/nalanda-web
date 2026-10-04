"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NEWS_CATEGORIES } from "@/data/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminHeading,
  CheckField,
  EmptyState,
  Field,
  SaveState,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/fields";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import { fetchStories, type SlotOption } from "@/lib/supabase/admin-queries";
import { browserClient } from "@/lib/supabase/browser";
import type { ArticleRow } from "@/lib/supabase/rows";

/**
 * News management.
 *
 * A story is more demanding than an announcement. It gets its own URL, it is
 * prerendered into its own HTML file, and it stays on the site indefinitely —
 * there is no expiry to fall back on. Two consequences shape this form.
 *
 * The slug is the URL and is therefore fixed after creation. `generateStaticParams`
 * writes one `out/news/<slug>/index.html` per story, so renaming a slug after
 * publication would break the link that has been shared; this panel has no way to
 * add a redirect because the host serves static files.
 *
 * The body is written as blank-line-separated paragraphs in a plain textarea
 * rather than through a rich-text editor. Article.body is `string[]`, one element
 * per paragraph, and a WYSIWYG field would mean storing HTML and sanitising it at
 * render — for content that is prose about a cadet band, a textarea is both
 * safer and quicker to use.
 */

interface Draft {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readMinutes: string;
  body: string;
  heroSlotId: string;
  published: boolean;
}

const today = () => new Date().toISOString().slice(0, 10);

/** Blank line between paragraphs. Tolerates blank lines that hold spaces. */
const toText = (body: string[] | null): string => (body ?? []).join("\n\n");

const fromText = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

const toDraft = (row: ArticleRow): Draft => ({
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  category: row.category,
  publishedAt: row.published_at ?? today(),
  readMinutes: String(row.read_minutes ?? 2),
  body: toText(row.body),
  heroSlotId: row.hero_slot_id ?? "",
  published: row.published,
});

const blankDraft = (): Draft => ({
  slug: "",
  title: "",
  excerpt: "",
  category: NEWS_CATEGORIES[0],
  publishedAt: today(),
  readMinutes: "2",
  body: "",
  heroSlotId: "",
  published: true,
});

export function NewsManager() {
  const [rows, setRows] = useState<ArticleRow[]>([]);
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    const supabase = browserClient();
    if (!supabase) return;

    let active = true;
    void fetchStories(supabase).then((result) => {
      if (!active) return;
      setRows(result.rows);
      setSlots(result.slots);
      setLoadError(result.error);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  // Called from click handlers after a write, not from an effect, so awaiting the
  // query before updating the list is the behaviour we want.
  const refresh = useCallback(async () => {
    const supabase = browserClient();
    if (!supabase) return;
    const result = await fetchStories(supabase);
    setRows(result.rows);
    setSlots(result.slots);
    setLoadError(result.error);
  }, []);

  const taken = useMemo(() => rows.map((r) => r.slug), [rows]);

  function startNew() {
    setDraft(blankDraft());
    setEditing("new");
    setState("idle");
    setError(null);
  }

  function startEdit(row: ArticleRow) {
    setDraft(toDraft(row));
    setEditing(row.slug);
    setState("idle");
    setError(null);
  }

  function close() {
    setEditing(null);
    setDraft(null);
    setState("idle");
    setError(null);
  }

  async function save() {
    const supabase = browserClient();
    if (!supabase || !draft) return;

    const wanted = draft.slug.trim() || slugify(draft.title);
    const slug = editing === "new" ? uniqueSlug(wanted, taken) : editing;

    const minutes = Number.parseInt(draft.readMinutes, 10);
    const readMinutes = Number.isFinite(minutes)
      ? Math.min(60, Math.max(1, minutes))
      : 2;

    setState("saving");
    setError(null);

    const shared = {
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      body: fromText(draft.body),
      category: draft.category,
      published_at: draft.publishedAt || null,
      read_minutes: readMinutes,
      hero_slot_id: draft.heroSlotId || null,
      published: draft.published,
    };

    const table = supabase.from("articles");
    const { error: saveError } =
      editing === "new"
        ? await table.insert({ slug, ...shared })
        : await table.update(shared).eq("slug", editing);

    if (saveError) {
      setState("error");
      setError(saveError.message);
      return;
    }

    await refresh();
    setState("saved");
    setEditing(null);
    setDraft(null);
  }

  async function remove(slug: string) {
    const supabase = browserClient();
    if (!supabase) return;

    setState("saving");
    setError(null);

    const { error: deleteError } = await supabase
      .from("articles")
      .delete()
      .eq("slug", slug);

    setConfirming(null);

    if (deleteError) {
      setState("error");
      setError(deleteError.message);
      return;
    }

    await refresh();
    setState("saved");
  }

  const invalid =
    draft !== null &&
    (!draft.title.trim() ||
      !draft.excerpt.trim() ||
      fromText(draft.body).length === 0 ||
      !(draft.slug.trim() || slugify(draft.title)));

  return (
    <div className="grid gap-8">
      <AdminHeading
        title="News"
        lede="Achievements and school news. Each story gets its own page at /news/<slug> when the site is next rebuilt."
        action={
          <Button onClick={editing === "new" ? close : startNew}>
            {editing === "new" ? "Cancel" : "New story"}
          </Button>
        }
      />

      <SaveState state={state} error={error} />

      {editing === "new" && draft ? (
        <StoryForm
          draft={draft}
          locked={false}
          slots={slots}
          onChange={setDraft}
          onSave={save}
          onCancel={close}
          busy={state === "saving"}
          invalid={invalid}
        />
      ) : null}

      {loadError ? (
        <p role="alert" className="text-sm text-danger">
          Could not load stories: {loadError}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-quiet-ink">Loading…</p>
      ) : rows.length === 0 && !loadError ? (
        <EmptyState>No stories yet. Create one to publish an article.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={row.slug} className="rounded-xl border bg-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{row.category}</Badge>
                    {!row.published ? (
                      <Badge variant="outline">Draft</Badge>
                    ) : null}
                  </div>
                  <h2 className="mt-2 font-serif text-lg leading-snug">
                    {row.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-quiet-ink">
                    /news/{row.slug} · {row.published_at ?? "—"} ·{" "}
                    {row.read_minutes ?? 2} min
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      editing === row.slug ? close() : startEdit(row)
                    }
                  >
                    {editing === row.slug ? "Cancel" : "Edit"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      confirming === row.slug
                        ? void remove(row.slug)
                        : setConfirming(row.slug)
                    }
                  >
                    {confirming === row.slug ? "Confirm delete" : "Delete"}
                  </Button>
                </div>
              </div>

              {confirming === row.slug ? (
                <p className="mt-3 text-xs text-danger">
                  This removes the story and its page. The URL it was published
                  at will stop working on the next rebuild.
                </p>
              ) : null}

              {editing === row.slug && draft ? (
                <div className="mt-5 border-t border-line pt-5">
                  <StoryForm
                    draft={draft}
                    locked
                    slots={slots}
                    onChange={setDraft}
                    onSave={save}
                    onCancel={close}
                    busy={state === "saving"}
                    invalid={invalid}
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StoryForm({
  draft,
  locked,
  slots,
  onChange,
  onSave,
  onCancel,
  busy,
  invalid,
}: {
  draft: Draft;
  locked: boolean;
  slots: SlotOption[];
  onChange: (next: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
  invalid: boolean;
}) {
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    onChange({ ...draft, [key]: value });

  return (
    <form
      className="grid gap-5 rounded-xl border bg-panel/40 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!invalid) onSave();
      }}
    >
      <Field label="Title" htmlFor="n-title">
        <TextInput
          id="n-title"
          value={draft.title}
          onChange={(event) => {
            const title = event.target.value;
            onChange({
              ...draft,
              title,
              slug: draft.slug || slugify(title),
            });
          }}
          required
        />
      </Field>

      <Field
        label="Summary"
        htmlFor="n-excerpt"
        hint="One or two sentences. This is the description search engines and link previews use, so it should stand alone."
      >
        <TextArea
          id="n-excerpt"
          rows={2}
          value={draft.excerpt}
          onChange={(event) => set("excerpt", event.target.value)}
          required
        />
      </Field>

      <Field
        label="Story"
        htmlFor="n-body"
        hint="Leave a blank line between paragraphs. Line breaks within a paragraph are ignored on the site."
      >
        <TextArea
          id="n-body"
          rows={12}
          value={draft.body}
          onChange={(event) => set("body", event.target.value)}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" htmlFor="n-category">
          <Select
            id="n-category"
            value={draft.category}
            onChange={(event) => set("category", event.target.value)}
          >
            {NEWS_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Published" htmlFor="n-published-at">
          <TextInput
            id="n-published-at"
            type="date"
            value={draft.publishedAt}
            onChange={(event) => set("publishedAt", event.target.value)}
          />
        </Field>

        <Field
          label="Reading time"
          htmlFor="n-minutes"
          hint="Minutes, 1 to 60."
        >
          <TextInput
            id="n-minutes"
            type="number"
            min={1}
            max={60}
            value={draft.readMinutes}
            onChange={(event) => set("readMinutes", event.target.value)}
          />
        </Field>

        <Field
          label="Photograph"
          htmlFor="n-hero"
          hint="Leave empty to use the seeded placeholder for this story."
        >
          <Select
            id="n-hero"
            value={draft.heroSlotId}
            onChange={(event) => set("heroSlotId", event.target.value)}
          >
            <option value="">Seeded placeholder</option>
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.gallery} · {slot.id}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Address"
        htmlFor="n-slug"
        hint={
          locked
            ? "Fixed once published. This is the page's URL, and the host serves static files with no redirects."
            : "Generated from the title. Edit it before saving if you want a different address."
        }
      >
        <TextInput
          id="n-slug"
          className="font-mono text-xs"
          value={draft.slug}
          readOnly={locked}
          onChange={(event) => set("slug", slugify(event.target.value))}
          placeholder="national-cadet-band-championship"
        />
      </Field>

      <CheckField
        id="n-published"
        label="Published"
        hint="Unpublished stories stay in the panel but never reach the site."
        checked={draft.published}
        onChange={(next) => set("published", next)}
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={busy || invalid}>
          {busy ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}