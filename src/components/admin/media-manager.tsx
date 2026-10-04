"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminHeading,
  CheckField,
  EmptyState,
  Field,
  SaveState,
  Select,
  TextInput,
} from "@/components/admin/fields";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import { fetchSlots } from "@/lib/supabase/admin-queries";
import { browserClient } from "@/lib/supabase/browser";
import { MEDIA_BUCKET, type MediaRow } from "@/lib/supabase/rows";

/**
 * Photograph and image management.
 *
 * The gallery is where this site is weakest: eleven of its frames are stand-ins
 * waiting on the college archive. So this panel is built around *replacing* a
 * placeholder with a real photograph, and around not letting that go wrong.
 *
 * `placeholder` is cleared by hand, never inferred. The gallery and the credits
 * page both label frames using this flag, and a frame that silently claimed to be
 * a photograph when it is a seeded stand-in would be a false statement on a page
 * that is otherwise scrupulous about sourcing. When an editor uploads a real
 * photograph the form points at the box rather than ticking it for them.
 *
 * Width and height are read from the uploaded file rather than asked for.
 * Every consumer of a MediaSlot passes them to next/image, and wrong dimensions
 * are the difference between a photograph and a grey smear — and these are
 * unoptimized images on a static export, so there is no server to correct it.
 *
 * Provenance is required for anything marked as a photograph. The database
 * enforces it, and the form asks for the four fields together.
 */

const GALLERIES = [
  { value: "gallery", label: "Gallery" },
  { value: "campus", label: "Campus" },
  { value: "hero", label: "Hero (masthead)" },
  { value: "news", label: "News thumbnail" },
] as const;

const LICENSE_PRESETS = [
  { label: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0" },
  { label: "CC BY 2.0", url: "https://creativecommons.org/licenses/by/2.0" },
  { label: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0" },
  { label: "CC BY-SA 3.0", url: "https://creativecommons.org/licenses/by-sa/3.0" },
  { label: "CC0 (public domain dedication)", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
];

interface Draft {
  id: string;
  gallery: string;
  src: string;
  storagePath: string;
  alt: string;
  width: string;
  height: string;
  credit: string;
  placeholder: boolean;
  plate: string;
  sourceAuthor: string;
  sourceLicense: string;
  sourceLicenseUrl: string;
  sourcePage: string;
  onHome: boolean;
  sortOrder: string;
  published: boolean;
}

const toDraft = (row: MediaRow): Draft => ({
  id: row.id,
  gallery: row.gallery,
  src: row.src,
  storagePath: row.storage_path ?? "",
  alt: row.alt,
  width: String(row.width),
  height: String(row.height),
  credit: row.credit ?? "",
  placeholder: row.placeholder,
  plate: row.plate ?? "",
  sourceAuthor: row.source_author ?? "",
  sourceLicense: row.source_license ?? "",
  sourceLicenseUrl: row.source_license_url ?? "",
  sourcePage: row.source_page ?? "",
  onHome: row.on_home,
  sortOrder: String(row.sort_order),
  published: row.published,
});

const blankDraft = (): Draft => ({
  id: "",
  gallery: "gallery",
  src: "",
  storagePath: "",
  alt: "",
  width: "1200",
  height: "900",
  credit: "",
  placeholder: true,
  plate: "",
  sourceAuthor: "",
  sourceLicense: "",
  sourceLicenseUrl: "",
  sourcePage: "",
  onHome: false,
  sortOrder: "0",
  published: true,
});

/**
 * Reads the real pixel dimensions of an image the editor picked.
 *
 * `createImageBitmap` decodes without adding the file to the DOM. An `<img>` plus
 * an object URL would leak a blob URL on every re-pick unless it were revoked, and
 * a decode failure is a thrown rejection rather than a silent 0×0.
 */
async function dimensions(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

export function MediaManager() {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = browserClient();
    if (!supabase) return;

    let active = true;
    void fetchSlots(supabase).then((result) => {
      if (!active) return;
      setRows(result.rows);
      setLoadError(result.error);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    const supabase = browserClient();
    if (!supabase) return;
    const result = await fetchSlots(supabase);
    setRows(result.rows);
    setLoadError(result.error);
  }, []);

  const taken = useMemo(() => rows.map((r) => r.id), [rows]);
  const awaiting = rows.filter((row) => row.placeholder).length;

  function startNew() {
    setDraft(blankDraft());
    setEditing("new");
    setState("idle");
    setError(null);
  }

  function startEdit(row: MediaRow) {
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

  /**
   * Uploads a picked file and folds its real URL and dimensions into the draft.
   *
   * The upload happens before the row is saved, so a failure here costs an
   * orphaned file rather than a row pointing at nothing. Storage keys include the
   * slot id, which keeps the bucket browsable by collection.
   */
  async function upload(file: File) {
    const supabase = browserClient();
    if (!supabase || !draft) return;

    setUploading(true);
    setState("saving");
    setError(null);

    try {
      const size = await dimensions(file);
      const base = draft.id || slugify(draft.alt) || "photograph";
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${draft.gallery}/${base}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(path);

      setDraft((current) =>
        current
          ? {
              ...current,
              id: current.id || base,
              src: urlData.publicUrl,
              storagePath: path,
              width: String(size.width),
              height: String(size.height),
              alt: current.alt || file.name.replace(/\.[^.]+$/, ""),
            }
          : current,
      );

      setState("idle");
    } catch (uploadError) {
      setState("error");
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The upload did not complete.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    const supabase = browserClient();
    if (!supabase || !draft) return;

    const wanted = draft.id.trim() || slugify(draft.alt);
    const id = editing === "new" ? uniqueSlug(wanted, taken) : editing;

    setState("saving");
    setError(null);

    const payload = {
      id,
      gallery: draft.gallery,
      src: draft.src.trim(),
      storage_path: draft.storagePath.trim() || null,
      alt: draft.alt.trim(),
      width: Number.parseInt(draft.width, 10),
      height: Number.parseInt(draft.height, 10),
      credit: draft.credit.trim(),
      placeholder: draft.placeholder,
      plate: draft.plate.trim() || null,
      source_author: draft.sourceAuthor.trim() || null,
      source_license: draft.sourceLicense.trim() || null,
      source_license_url: draft.sourceLicenseUrl.trim() || null,
      source_page: draft.sourcePage.trim() || null,
      on_home: draft.onHome,
      sort_order: Number.parseInt(draft.sortOrder, 10) || 0,
      published: draft.published,
    };

    const table = supabase.from("media_slots");
    const { error: saveError } =
      editing === "new"
        ? await table.insert(payload)
        : await table
            .update({
              gallery: payload.gallery,
              src: payload.src,
              storage_path: payload.storage_path,
              alt: payload.alt,
              width: payload.width,
              height: payload.height,
              credit: payload.credit,
              placeholder: payload.placeholder,
              plate: payload.plate,
              source_author: payload.source_author,
              source_license: payload.source_license,
              source_license_url: payload.source_license_url,
              source_page: payload.source_page,
              on_home: payload.on_home,
              sort_order: payload.sort_order,
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

  const invalid =
    draft !== null &&
    (!draft.src.trim() ||
      !draft.alt.trim() ||
      !Number.isFinite(Number.parseInt(draft.width, 10)) ||
      !Number.isFinite(Number.parseInt(draft.height, 10)) ||
      // Mirrors the provenance_is_complete constraint, so the editor is told what
      // is missing here rather than receiving a Postgres error.
      (!draft.placeholder &&
        (!draft.sourceAuthor.trim() ||
          !draft.sourceLicense.trim() ||
          !draft.sourceLicenseUrl.trim() ||
          !draft.sourcePage.trim())));

  return (
    <div className="grid gap-8">
      <AdminHeading
        title="Photographs"
        lede="The hero, the gallery, the campus page and every news thumbnail. Eleven frames are still placeholders waiting on the college archive."
        action={
          <Button onClick={editing === "new" ? close : startNew}>
            {editing === "new" ? "Cancel" : "Add photograph"}
          </Button>
        }
      />

      <SaveState state={state} error={error} />

      {awaiting > 0 ? (
        <p className="rounded-xl border border-line bg-panel px-5 py-4 text-sm">
          <span className="font-medium">{awaiting}</span> of {rows.length}{" "}
          frames are placeholders. The site labels them as such wherever they
          appear, and lists them on the credits page.
        </p>
      ) : null}

      {editing === "new" && draft ? (
        <SlotForm
          draft={draft}
          locked={false}
          uploading={uploading}
          fileInput={fileInput}
          onPick={upload}
          onChange={setDraft}
          onSave={save}
          onCancel={close}
          busy={state === "saving"}
          invalid={invalid}
        />
      ) : null}

      {loadError ? (
        <p role="alert" className="text-sm text-danger">
          Could not load photographs: {loadError}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-quiet-ink">Loading…</p>
      ) : rows.length === 0 && !loadError ? (
        <EmptyState>
          No image slots in the database. Run <code>npm run seed</code> to load
          the current site content, or add one here.
        </EmptyState>
      ) : (
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-xl border bg-panel p-5">
              <div className="flex flex-wrap items-start gap-5">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border bg-alt">
                  <Image
                    src={row.src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="ghost">{row.gallery}</Badge>
                    {row.placeholder ? (
                      <Badge variant="outline">Placeholder</Badge>
                    ) : (
                      <Badge variant="secondary">Photograph</Badge>
                    )}
                    {row.on_home ? (
                      <Badge variant="secondary">Home page</Badge>
                    ) : null}
                    {!row.published ? (
                      <Badge variant="outline">Hidden</Badge>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-sm leading-snug">{row.alt}</h2>
                  <p className="mt-1 font-mono text-xs text-quiet-ink">
                    {row.id} · {row.width}×{row.height}
                    {row.source_author ? ` · ${row.source_author}` : ""}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (editing === row.id ? close() : startEdit(row))}
                >
                  {editing === row.id ? "Cancel" : "Edit"}
                </Button>
              </div>

              {editing === row.id && draft ? (
                <div className="mt-5 border-t border-line pt-5">
                  <SlotForm
                    draft={draft}
                    locked
                    uploading={uploading}
                    fileInput={fileInput}
                    onPick={upload}
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

function SlotForm({
  draft,
  locked,
  uploading,
  fileInput,
  onPick,
  onChange,
  onSave,
  onCancel,
  busy,
  invalid,
}: {
  draft: Draft;
  locked: boolean;
  uploading: boolean;
  fileInput: React.RefObject<HTMLInputElement | null>;
  onPick: (file: File) => void;
  onChange: (next: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
  invalid: boolean;
}) {
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    onChange({ ...draft, [key]: value });

  const applyLicense = (value: string) => {
    const preset = LICENSE_PRESETS.find((entry) => entry.label === value);
    set("sourceLicense", preset?.label ?? value);
    if (preset) set("sourceLicenseUrl", preset.url);
  };

  return (
    <form
      className="grid gap-5 rounded-xl border bg-panel/40 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!invalid) onSave();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Upload a photograph"
          htmlFor="m-file"
          hint="Stored in Supabase Storage and served from its CDN. Leave empty to keep the current file."
        >
          <input
            id="m-file"
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              // Reset so re-picking the same file fires change again.
              event.target.value = "";
              if (file) void onPick(file);
            }}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-alt file:px-3 file:py-1 file:text-xs file:text-alt-ink"
          />
          {uploading ? (
            <p className="text-xs text-quiet-ink">Uploading…</p>
          ) : null}
        </Field>

        <Field
          label="Identifier"
          htmlFor="m-id"
          hint={
            locked
              ? "Fixed once created."
              : "Generated from the description or the uploaded file name."
          }
        >
          <TextInput
            id="m-id"
            className="font-mono text-xs"
            value={draft.id}
            readOnly={locked}
            onChange={(event) => set("id", slugify(event.target.value))}
            placeholder="swimming-pool"
          />
        </Field>

        <Field label="Collection" htmlFor="m-gallery">
          <Select
            id="m-gallery"
            value={draft.gallery}
            onChange={(event) => set("gallery", event.target.value)}
          >
            {GALLERIES.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Order"
          htmlFor="m-order"
          hint="Lower numbers come first."
        >
          <TextInput
            id="m-order"
            type="number"
            value={draft.sortOrder}
            onChange={(event) => set("sortOrder", event.target.value)}
          />
        </Field>

        <Field label="Width" htmlFor="m-width">
          <TextInput
            id="m-width"
            type="number"
            value={draft.width}
            onChange={(event) => set("width", event.target.value)}
          />
        </Field>

        <Field label="Height" htmlFor="m-height">
          <TextInput
            id="m-height"
            type="number"
            value={draft.height}
            onChange={(event) => set("height", event.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Description"
        htmlFor="m-alt"
        hint="What the photograph shows, for readers who cannot see it. This is the alt text on the site."
      >
        <TextInput
          id="m-alt"
          value={draft.alt}
          onChange={(event) => set("alt", event.target.value)}
          required
        />
      </Field>

      <Field
        label="Credit line"
        htmlFor="m-credit"
        hint="Shown beneath the frame. Leave empty for a photograph the college owns."
      >
        <TextInput
          id="m-credit"
          value={draft.credit}
          onChange={(event) => set("credit", event.target.value)}
        />
      </Field>

      <Field label="Ledger plate" htmlFor="m-plate" hint="Optional, e.g. IV.">
        <TextInput
          id="m-plate"
          className="font-mono text-xs"
          value={draft.plate}
          onChange={(event) => set("plate", event.target.value)}
        />
      </Field>

      <fieldset className="grid gap-4 rounded-lg border p-4">
        <legend className="field px-2">Provenance</legend>
        <p className="-mt-2 text-xs text-quiet-ink">
          Required for anything that is not a placeholder — that is, anything the
          college does not own. The credits page publishes these four fields.
        </p>

        <Field label="Photographer" htmlFor="m-author">
          <TextInput
            id="m-author"
            value={draft.sourceAuthor}
            onChange={(event) => set("sourceAuthor", event.target.value)}
          />
        </Field>

        <Field label="Licence" htmlFor="m-license">
          <Select
            id="m-license"
            value={
              LICENSE_PRESETS.some((p) => p.label === draft.sourceLicense)
                ? draft.sourceLicense
                : draft.sourceLicense
                  ? "other"
                  : ""
            }
            onChange={(event) => {
              if (event.target.value === "other") {
                set("sourceLicense", draft.sourceLicense);
              } else {
                applyLicense(event.target.value);
              }
            }}
          >
            <option value="">Not applicable</option>
            {LICENSE_PRESETS.map((preset) => (
              <option key={preset.label} value={preset.label}>
                {preset.label}
              </option>
            ))}
            <option value="other">Other licence…</option>
          </Select>
        </Field>

        <Field label="Licence URL" htmlFor="m-license-url">
          <TextInput
            id="m-license-url"
            className="font-mono text-xs"
            value={draft.sourceLicenseUrl}
            onChange={(event) => set("sourceLicenseUrl", event.target.value)}
          />
        </Field>

        <Field
          label="Original file"
          htmlFor="m-page"
          hint="The Commons or publisher page the photograph came from."
        >
          <TextInput
            id="m-page"
            className="font-mono text-xs"
            value={draft.sourcePage}
            onChange={(event) => set("sourcePage", event.target.value)}
          />
        </Field>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <CheckField
          id="m-placeholder"
          label="Still a placeholder"
          hint="Leave this on until a real photograph of the subject exists."
          checked={draft.placeholder}
          onChange={(next) => set("placeholder", next)}
        />
        <CheckField
          id="m-home"
          label="Show on the home page"
          hint="Adds it to the photograph band under the hero."
          checked={draft.onHome}
          onChange={(next) => set("onHome", next)}
        />
        <CheckField
          id="m-published"
          label="Visible on the site"
          hint="Hidden frames stay in the panel but are not built."
          checked={draft.published}
          onChange={(next) => set("published", next)}
        />
      </div>

      {draft.src ? (
        <p className="break-all font-mono text-xs text-quiet-ink">
          {draft.src}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={busy || invalid || uploading}>
          {busy ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}