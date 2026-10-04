"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { fetchStatus, type StatusRow } from "@/lib/supabase/admin-queries";
import { browserClient } from "@/lib/supabase/browser";

/**
 * The overview.
 *
 * Reads `content_status`, one aggregate row per collection. One query instead of
 * a count per table: on a static export these are round trips from a visitor's
 * browser, and every number should come from the same instant rather than drift
 * between queries.
 *
 * The `last_change` column earns its place here. "I saved it and the site did not
 * change" is the question an editor arrives with, and the honest answer is a
 * timestamp — the save went to the database, the site needs a rebuild, and this is
 * when the database last moved.
 */

const SECTIONS = [
  {
    entity: "announcements",
    href: "/admin/announcements",
    title: "Announcements",
    blurb: "Notices on the board, with categories, severity and expiry.",
    live: "live",
  },
  {
    entity: "articles",
    href: "/admin/news",
    title: "News",
    blurb: "Stories, each with its own page and address.",
    live: "live",
  },
  {
    entity: "media_slots",
    href: "/admin/media",
    title: "Photographs",
    blurb: "The hero, gallery, campus page and news thumbnails.",
    live: "visible",
  },
];

export function AdminDashboard() {
  const [status, setStatus] = useState<Record<string, StatusRow>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = browserClient();
    if (!supabase) return;

    let active = true;
    void fetchStatus(supabase).then((result) => {
      // The panel unmounts on sign-out and on navigation, and a query that lands
      // afterwards must not write into a component that is gone.
      if (!active) return;
      setStatus(
        Object.fromEntries(result.rows.map((row) => [row.entity, row])),
      );
      setError(result.error);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const rows = Object.values(status);

  return (
    <div className="grid gap-8">
      <div>
        <p className="field">Overview</p>
        <h1 className="font-serif text-3xl leading-tight">
          What is on the site
        </h1>
        <p className="measure mt-3 text-sm text-quiet-ink">
          Edits are saved to the database immediately, but the public site is a
          static export. A change appears on the site once the rebuild triggered
          by that change has finished — usually a minute or two.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          Could not read the counts: {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-quiet-ink">Loading…</p>
      ) : null}

      {!loading && rows.length === 0 && !error ? (
        <p className="text-sm text-quiet-ink">
          No counts came back. The schema is probably not applied yet — see{" "}
          <code className="font-mono text-xs">docs/admin-panel.md</code>.
        </p>
      ) : null}

      <ul className="grid gap-3">
        {SECTIONS.map((section) => {
          const row = status[section.entity];
          const total = row ? row.published + row.drafts : 0;

          return (
            <li key={section.href} className="rounded-xl border bg-panel/40 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-serif text-lg leading-snug">
                    {section.title}
                  </h2>
                  <p className="measure mt-1 text-sm text-quiet-ink">
                    {section.blurb}
                  </p>
                </div>
                {row ? (
                  <Badge variant="secondary">
                    {row.published} of {total} {section.live}
                  </Badge>
                ) : null}
              </div>

              {row ? (
                <p className="mt-3 font-mono text-xs text-quiet-ink">
                  {row.drafts > 0 ? (
                    <>
                      {row.drafts} draft{row.drafts === 1 ? "" : "s"} ·{" "}
                    </>
                  ) : null}
                  last changed {formatWhen(row.last_change)}
                </p>
              ) : null}

              <Link
                href={section.href}
                className="mt-4 inline-block rounded-lg border px-4 py-2 text-sm transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Edit {section.title.toLowerCase()}
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="rounded-xl border bg-panel/40 p-5">
        <h2 className="font-serif text-lg leading-snug">Adding an editor</h2>
        <p className="measure mt-2 text-sm text-quiet-ink">
          Accounts are created in the Supabase dashboard, not here — this panel
          cannot create them, and the{" "}
          <code className="font-mono text-xs">admins</code> table has no insert
          policy, so nothing running in a browser can grant itself access. After
          creating an account, insert a row for its email in{" "}
          <code className="font-mono text-xs">admins</code>; the account can sign in
          as soon as that row exists.
        </p>
      </section>
    </div>
  );
}

/**
 * Formats the view's `last_change` for display.
 *
 * This reads a clock during render, which is the thing the hydration gate in
 * `scripts/verify.mjs` exists to catch, so it is worth being precise about why
 * this one is safe.
 *
 * The gate forbids a clock read inside a `useMemo`/`useState` initialiser,
 * because those run on both passes and can disagree. This does not. The
 * prerendered HTML contains no timestamps at all: `status` is empty until the
 * effect's fetch resolves, so the server pass never reaches this function. By the
 * time it does, the value is fixed by the argument.
 *
 * It is also formatted in UTC explicitly rather than in the reader's zone, so two
 * people looking at the same row see the same string — the alternative, a local
 * time, would make the number mean something different on each machine.
 */
function formatWhen(iso: string | null): string {
  if (!iso) return "never";

  const stamp = new Date(iso).toISOString();
  return `${stamp.slice(0, 10)} ${stamp.slice(11, 16)} UTC`;
}