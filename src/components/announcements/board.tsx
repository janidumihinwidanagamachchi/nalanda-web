"use client";

import { useMemo } from "react";
import { useUrlFilter } from "@/lib/use-url-filter";
import {
  ANNOUNCEMENT_CATEGORIES,
  isExpired,
  type Announcement,
  type AnnouncementCategory,
  type Severity,
} from "@/data/announcements";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const SEVERITY_VARIANT: Record<Severity, "danger" | "default" | "outline"> = {
  urgent: "danger",
  important: "default",
  info: "outline",
};

/**
 * Reading the clock during render is safe *here only*.
 *
 * `useUrlFilter` reads `useSearchParams`, and this component sits inside a
 * `Suspense` boundary. Under `output: "export"` that makes Next emit only the
 * skeleton fallback into the static HTML and mount the real rows client-side
 * after hydration. Confirm in `out/announcements/index.html`: it contains
 * `animate-pulse` and none of the announcement titles.
 *
 * Because there is no server-rendered markup to compare against, a clock read
 * during render cannot produce a hydration mismatch, and expiry is re-evaluated
 * on every visit — notices lapse without needing a rebuild.
 *
 * Two things would break that reasoning, so neither is done here:
 *  - Serialising a build-time `today` from the server would freeze expiry until
 *    the next rebuild, for a mismatch that cannot occur.
 *  - Removing the `Suspense` boundary, or the `useSearchParams` dependency,
 *    would make this subtree prerenderable. Then the clock read and the
 *    prerendered HTML would disagree once a notice expired between the build
 *    and the page load, and the `today` prop would become necessary.
 *
 * The notices arrive as a prop rather than an import. A client component cannot
 * await a build-time database read, and this subtree has to stay a client
 * component for the reasons above, so the server page resolves the content and
 * hands it down. The types and the pure `isExpired` helper still come from
 * src/data, which is why moving announcements into Supabase changed nothing
 * here.
 */
export function AnnouncementsBoard({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [filter, setFilter] = useUrlFilter<AnnouncementCategory | "All">(
    "category",
    ["All", ...ANNOUNCEMENT_CATEGORIES],
    "All",
  );

  const today = useMemo(() => new Date(), []);
  const live = useMemo(
    () =>
      announcements.filter((a) => !isExpired(a, today)).sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }),
    [announcements, today],
  );

  const shown =
    filter === "All" ? live : live.filter((a) => a.category === filter);

  return (
    <div>
      <FilterTabs
        options={["All", ...ANNOUNCEMENT_CATEGORIES] as const}
        value={filter}
        onChange={setFilter}
        label="Filter announcements by category"
      />

      <div className="mt-10 grid gap-4">
        {shown.map((announcement) => (
          <AnnouncementRow key={announcement.id} announcement={announcement} />
        ))}
        {shown.length === 0 ? (
          <p className="rounded-xl border bg-panel px-6 py-12 text-center text-sm text-quiet-ink">
            No current announcements in this category.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function AnnouncementRow({ announcement }: { announcement: Announcement }) {
  const published = formatDate(announcement.publishedAt);
  const expires = announcement.expiresAt
    ? formatDate(announcement.expiresAt)
    : null;

  return (
    <article className="relative overflow-hidden rounded-xl border bg-panel p-6 md:p-8">
      {announcement.pinned ? (
        <span
          className="absolute left-0 top-0 h-full w-0.5 bg-brand"
          aria-hidden
        />
      ) : null}

      <div className="grid gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={SEVERITY_VARIANT[announcement.severity]}>
              {announcement.severity}
            </Badge>
            {announcement.pinned ? (
              <Badge variant="outline">Pinned</Badge>
            ) : null}
          </div>
          <p className="mt-4 font-mono text-xs text-quiet-ink">{published}</p>
          {expires ? (
            <p className="mt-1 font-mono text-xs text-brand">Closes {expires}</p>
          ) : null}
          <p className="mt-3 text-xs text-quiet-ink">{announcement.category}</p>
        </div>

        <div className="md:col-span-9">
          <h2 className="font-serif text-2xl leading-snug">
            {announcement.title}
          </h2>
          <p className="measure mt-3 text-sm text-quiet-ink">
            {announcement.body}
          </p>
          {announcement.attachments?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {announcement.attachments.map((attachment) => (
                <li key={attachment.href}>
                  <a
                    href={attachment.href}
                    className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs text-ink transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand"
                  >
                    {attachment.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}