"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Form primitives for the admin panel.
 *
 * Written against the site's own tokens rather than pulled in as a component
 * library, so the panel looks like the college's site instead of a generic CMS.
 * The site has no shadcn/radix-form layer and adding one for four forms would be
 * the largest dependency in the project.
 *
 * Every control is labelled and every label is associated with its input by id,
 * because the alternative — a placeholder standing in for a label — disappears
 * the moment an editor starts typing.
 */

const CONTROL =
  "w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink " +
  "placeholder:text-quiet-ink/60 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus " +
  "disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="field">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-quiet-ink">{hint}</p> : null}
    </div>
  );
}

export function TextInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input className={cn(CONTROL, className)} {...props} />;
}

export function TextArea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return <textarea className={cn(CONTROL, "min-h-24 resize-y", className)} {...props} />;
}

export function Select({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return <select className={cn(CONTROL, className)} {...props} />;
}

/**
 * A checkbox with its label beside it rather than above.
 *
 * `peer` on the input and `peer-checked:` on the box means the visible state is
 * driven by the real input, so it cannot drift from the value that gets saved.
 */
export function CheckField({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded border bg-canvas font-mono text-[11px] leading-none text-brand-ink",
          "peer-checked:border-brand peer-checked:bg-brand",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-focus",
        )}
      >
        {checked ? "✓" : ""}
      </span>
      <label htmlFor={id} className="cursor-pointer text-sm">
        {label}
        {hint ? (
          <span className="mt-0.5 block text-xs text-quiet-ink">{hint}</span>
        ) : null}
      </label>
    </div>
  );
}

/** Panel-level heading. */
export function AdminHeading({
  title,
  lede,
  action,
}: {
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        <h1 className="font-serif text-3xl leading-tight">{title}</h1>
        {lede ? (
          <p className="measure mt-2 text-sm text-quiet-ink">{lede}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/**
 * The result of a save.
 *
 * `tone` is named for how it reads, not how it looks: an editor who has just
 * pressed Save needs to know whether the row changed, and a static export means
 * the live site does not change until a rebuild finishes.
 */
export function SaveState({
  state,
  error,
}: {
  state: "idle" | "saving" | "saved" | "error";
  error?: string | null;
}) {
  if (state === "idle") return null;

  const copy = {
    saving: "Saving…",
    saved: "Saved to the database.",
    error: "Not saved.",
  } as const;

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "text-sm",
        state === "error" ? "text-danger" : "text-quiet-ink",
      )}
    >
      {copy[state]}
      {state === "saved" ? (
        <span className="mt-1 block text-xs">
          The live site updates when the rebuild finishes, usually within a
          couple of minutes.
        </span>
      ) : null}
      {state === "error" && error ? (
        <span className="mt-1 block text-xs">{error}</span>
      ) : null}
    </p>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border bg-panel px-6 py-12 text-center text-sm text-quiet-ink">
      {children}
    </p>
  );
}