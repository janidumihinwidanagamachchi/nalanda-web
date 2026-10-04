"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ANNOUNCEMENT_CATEGORIES, type Severity } from "@/data/announcements";
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
import { fetchAnnouncements } from "@/lib/supabase/admin-queries";
import { browserClient } from "@/lib/supabase/browser";
import type { AnnouncementRow } from "@/lib/supabase/rows";

/**
 * Announcement management.
 *
 * Announcements are the highest-stakes content on the site: this is where a
 * parent's deadline comes from. Three rules follow from that and shape this
 * component.
 *
 * `id` is the primary key, not an afterthought, and it is editable in the form
 * rather than hidden. An editor who renames an announcement needs to know it is
 * the identity, because deleting and recreating to change one loses the audit
 * trail. The list shows it in monospace so the consequence is visible.
 *
 * Expiry is an explicit optional date rather than a computed one. Nothing here
 * derives a closing date from a sentence in the body: a deadline that only exists
 * as prose is a deadline the site cannot stop showing.
 *
 * Deleting is two-step rather than a `confirm()` dialog. A deadline notice is not
 * something to lose to a single stray click, and a native modal cannot be styled
 * or keyboard-navigated the way the rest of this panel is.
 */

const SEVERITIES: Severity[] = ["info", "important", "urgent"];

interface Draft {
  id: string;
  title: string;
  body: string;
  category: string;
  severity: string;
  publishedAt: string;
  expiresAt: string;
  pinned: boolean;
  published: boolean;
  attachments: string;
}

const today = () => new Date().toISOString().slice(0, 10);

/** "Label | href" per line. A text format rather than a nested row editor. */
const toText = (row: AnnouncementRow): string =>
  Array.isArray(row.attachments)
    ? row.attachments
        .filter(
          (a): a is { label: string; href: string } =>
            typeof a === "object" &&
            a !== null &&
            typeof (a as { label?: unknown }).label === "string" &&
            typeof (a as { href?: unknown }).href === "string",
        )
        .map((a) => `${a.label} | ${a.href}`)
        .join("\n")
    : "";

const fromText = (text: string): { label: string; href: string }[] =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf("|");
      if (separator === -1) return null;
      const label = line.slice(0, separator).trim();
      const href = line.slice(separator + 1).trim();
      // A line with no href is dropped rather than saved broken: it would render
      // as a link to nowhere on a page people rely on for deadlines.
      return label && href ? { label, href } : null;
    })
    .filter((a): a is { label: string; href: string } => a !== null);

const toDraft = (row: AnnouncementRow): Draft => ({
  id: row.id,
  title: row.title,
  body: row.body,
  category: row.category,
  severity: row.severity,
  publishedAt: row.published_at ?? today(),
  expiresAt: row.expires_at ?? "",
  pinned: row.pinned,
  published: row.published,
  attachments: toText(row),
});

const blankDraft = (): Draft => ({
  id: "",
  title: "",
  body: "",
  category: ANNOUNCEMENT_CATEGORIES[0],
  severity: "info",
  publishedAt: today(),
  expiresAt: "",
  pinned: false,
  published: true,
  attachments: "",
});

export function AnnouncementsManager() {
  const [rows, setRows] = useState<AnnouncementRow[]>([]);
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
    void fetchAnnouncements(supabase).then((result) => {
      // A save followed immediately by navigation can resolve here after the
      // component is gone; the flag makes that a no-op.
      if (!active) return;
      setRows(result.rows);
      setLoadError(result.error);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  // Re-reads after a write. Deliberately not in an effect: this is called from a
  // click handler, where waiting for the query is exactly right.
  const refresh = useCallback(async () => {
    const supabase = browserClient();
    if (!supabase) return;
    const result = await fetchAnnouncements(supabase);
    setRows(result.rows);
    setLoadError(result.error);
  }, []);

  const taken = useMemo(() => rows.map((r) => r.id), [rows]);

  function startNew() {
    setDraft(blankDraft());
    setEditing("new");
    setState("idle");
    setError(null);
  }

  function startEdit(row: AnnouncementRow) {
    setDraft(toDraft(row));
    setEditing(row.id);
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

    // The id is generated from the title unless the editor typed one, and checked
    // against the ids in use so a duplicate cannot reach the database as a primary
    // key violation with an opaque message.
    const wanted = draft.id.trim() || slugify(draft.title);
    const id = editing === "new" ? uniqueSlug(wanted, taken) : editing;

    setState("saving");
    setError(null);

    const payload = {
      id,
      title: draft.title.trim(),
      body: draft.body.trim(),
      category: draft.category,
      severity: draft.severity,
      published_at: draft.publishedAt || null,
      expires_at: draft.expiresAt || null,
      pinned: draft.pinned,
      attachments: fromText(draft.attachments),
      published: draft.published,
    };

    // An update cannot carry the id, because the id is the primary key. The form
    // makes the identifier read-only once a row exists, so there is no rename to
    // handle and no delete-then-insert that could lose a notice.
    const table = supabase.from("announcements");
    const { error: saveError } =
      editing === "new"
        ? await table.insert(payload)
        : await table
            .update({
              title: payload.title,
              body: payload.body,
              category: payload.category,
              severity: payload.severity,
              published_at: payload.published_at,
              expires_at: payload.expires_at,
              pinned: payload.pinned,
              attachments: payload.attachments,
              published: payload.published,
            })
            .eq("id", editing);

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

  async function remove(id: string) {
    const supabase = browserClient();
    if (!supabase) return;

    setState("saving");
    setError(null);

    const { error: deleteError } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

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
      !draft.body.trim() ||
      !(draft.id.trim() || slugify(draft.title)));

  return (
    <div className="grid gap-8">
      <AdminHeading
        title="Announcements"
        lede="Operational notices with deadlines. A notice with a closing date disappears from the site once that date has passed."
        action={
          <Button onClick={editing === "new" ? close : startNew}>
            {editing === "new" ? "Cancel" : "New announcement"}
          </Button>
        }
      />

      <SaveState state={state} error={error} />

      {editing === "new" && draft ? (
        <AnnouncementForm
          draft={draft}
          locked={false}
          onChange={setDraft}
          onSave={save}
          onCancel={close}
          busy={state === "saving"}
          invalid={invalid}
        />
      ) : null}

      {loadError ? (
        <p role="alert" className="text-sm text-danger">
          Could not load announcements: {loadError}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-quiet-ink">Loading…</p>
      ) : rows.length === 0 && !loadError ? (
        <EmptyState>
          No announcements yet. Create one to publish a notice on the site.
        </EmptyState>
      ) : (
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-xl border bg-panel p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        row.severity === "urgent"
                          ? "danger"
                          : row.severity === "important"
                            ? "default"
                            : "outline"
                      }
                    >
                      {row.severity}
                    </Badge>
                    <Badge variant="ghost">{row.category}</Badge>
                    {row.pinned ? (
                      <Badge variant="secondary">Pinned</Badge>
                    ) : null}
                    {!row.published ? (
                      <Badge variant="outline">Draft</Badge>
                    ) : null}
                  </div>
                  <h2 className="mt-2 font-serif text-lg leading-snug">
                    {row.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-quiet-ink">
                    {row.id} · published {row.published_at ?? "—"}
                    {row.expires_at ? ` · closes ${row.expires_at}` : ""}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      editing === row.id ? close() : startEdit(row)
                    }
                  >
                    {editing === row.id ? "Cancel" : "Edit"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      confirming === row.id
                        ? void remove(row.id)
                        : setConfirming(row.id)
                    }
                  >
                    {confirming === row.id ? "Confirm delete" : "Delete"}
                  </Button>
                </div>
              </div>

              {confirming === row.id ? (
                <p className="mt-3 text-xs text-danger">
                  This removes the notice and its record. It cannot be undone.
                </p>
              ) : null}

              {editing === row.id && draft ? (
                <div className="mt-5 border-t border-line pt-5">
                  <AnnouncementForm
                    draft={draft}
                    locked
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

function AnnouncementForm({
  draft,
  locked,
  onChange,
  onSave,
  onCancel,
  busy,
  invalid,
}: {
  draft: Draft;
  locked: boolean;
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
      <Field label="Title" htmlFor="a-title">
        <TextInput
          id="a-title"
          value={draft.title}
          onChange={(event) => {
            const title = event.target.value;
            // Track the title into the id only while the editor has not touched
            // the id themselves, so a deliberate id is never overwritten.
            onChange({
              ...draft,
              title,
              id: draft.id || slugify(title),
            });
          }}
          required
        />
      </Field>

      <Field
        label="Notice text"
        htmlFor="a-body"
        hint="Plain text. This is the authoritative notice on the site, so keep it identical to the printed circular."
      >
        <TextArea
          id="a-body"
          rows={5}
          value={draft.body}
          onChange={(event) => set("body", event.target.value)}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" htmlFor="a-category">
          <Select
            id="a-category"
            value={draft.category}
            onChange={(event) => set("category", event.target.value)}
          >
            {ANNOUNCEMENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Severity" htmlFor="a-severity">
          <Select
            id="a-severity"
            value={draft.severity}
            onChange={(event) => set("severity", event.target.value)}
          >
            {SEVERITIES.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Published" htmlFor="a-published-at">
          <TextInput
            id="a-published-at"
            type="date"
            value={draft.publishedAt}
            onChange={(event) => set("publishedAt", event.target.value)}
          />
        </Field>

        <Field
          label="Closes"
          htmlFor="a-expires-at"
          hint="Leave empty if it does not close."
        >
          <TextInput
            id="a-expires-at"
            type="date"
            value={draft.expiresAt}
            onChange={(event) => set("expiresAt", event.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Identifier"
        htmlFor="a-id"
        hint={
          locked
            ? "Fixed once created. It is the notice's identity, and changing it would remove the old row and create a new one."
            : "Generated from the title. Edit it before saving if you want a different one."
        }
      >
        <TextInput
          id="a-id"
          className="font-mono text-xs"
          value={draft.id}
          readOnly={locked}
          onChange={(event) => set("id", slugify(event.target.value))}
          placeholder="g1-2027-applications"
        />
      </Field>

      <Field
        label="Attachments"
        htmlFor="a-attachments"
        hint="One per line, as Label | https://url. Lines without a URL are ignored."
      >
        <TextArea
          id="a-attachments"
          rows={3}
          className="font-mono text-xs"
          value={draft.attachments}
          onChange={(event) => set("attachments", event.target.value)}
          placeholder="Circular 25/2026 | /nalanda-web/downloads/circular-25-2026.pdf"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <CheckField
          id="a-pinned"
          label="Pin to the top"
          hint="Keeps it above newer notices."
          checked={draft.pinned}
          onChange={(next) => set("pinned", next)}
        />
        <CheckField
          id="a-published"
          label="Published"
          hint="Unpublished notices stay in the panel but never reach the site."
          checked={draft.published}
          onChange={(next) => set("published", next)}
        />
      </div>

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