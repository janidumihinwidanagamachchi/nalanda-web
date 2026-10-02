"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { DURATION, EASE, SPRING } from "@/constants/motion";
import { useUrlFilter } from "@/lib/use-url-filter";
import {
  ANNOUNCEMENT_CATEGORIES,
  ANNOUNCEMENTS,
  isExpired,
  type Announcement,
  type AnnouncementCategory,
  type Severity,
} from "@/data/announcements";

const SEVERITY_STYLE: Record<Severity, string> = {
  urgent: "border-accent bg-accent text-surface-raised",
  important: "border-accent/40 text-accent",
  info: "border-line text-ink-subtle",
};

export function AnnouncementsBoard() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useUrlFilter<AnnouncementCategory | "All">(
    "category",
    ["All", ...ANNOUNCEMENT_CATEGORIES],
    "All",
  );

  const today = useMemo(() => new Date(), []);
  const live = useMemo(
    () =>
      ANNOUNCEMENTS.filter((a) => !isExpired(a, today)).sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }),
    [today],
  );

  const shown =
    filter === "All" ? live : live.filter((a) => a.category === filter);

  return (
    <div>
      <div
        className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0"
        role="tablist"
        aria-label="Filter announcements by category"
      >
        {(["All", ...ANNOUNCEMENT_CATEGORIES] as const).map((category) => {
          const active = filter === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(category)}
              className={`relative shrink-0 rounded-[var(--radius-pill)] px-4 py-2 text-sm transition-colors duration-200 ${
                active ? "text-surface-raised" : "text-ink-muted hover:text-ink"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="announcement-filter"
                  className="absolute inset-0 -z-10 rounded-[var(--radius-pill)] bg-accent"
                  transition={SPRING.apple}
                  aria-hidden
                />
              ) : null}
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-10 space-y-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((announcement, index) => (
            <AnnouncementRow
              key={announcement.id}
              announcement={announcement}
              index={index}
              reduce={Boolean(reduce)}
            />
          ))}
        </AnimatePresence>
        {shown.length === 0 ? (
          <p className="bg-surface-raised px-6 py-12 text-center text-sm text-ink-subtle">
            No current announcements in this category.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function AnnouncementRow({
  announcement,
  index,
  reduce,
}: {
  announcement: Announcement;
  index: number;
  reduce: boolean;
}) {
  const published = formatDate(announcement.publishedAt);
  const expires = announcement.expiresAt ? formatDate(announcement.expiresAt) : null;

  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -12 }}
      transition={{
        duration: DURATION.dropdown,
        delay: reduce ? 0 : index * 0.05,
        ease: EASE.strongOut,
      }}
      className="group relative bg-surface-raised"
    >
      {announcement.pinned ? (
        <span className="absolute left-0 top-0 h-full w-0.5 bg-accent" aria-hidden />
      ) : null}

      <div className="grid gap-5 px-6 py-7 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-[2px] border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${
                SEVERITY_STYLE[announcement.severity]
              }`}
            >
              {announcement.severity}
            </span>
            {announcement.pinned ? (
              <span className="rounded-[2px] border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
                Pinned
              </span>
            ) : null}
          </div>
          <p className="mt-3 font-mono text-xs text-ink-subtle">{published}</p>
          {expires ? (
            <p className="mt-1 font-mono text-xs text-accent">
              Closes {expires}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-ink-subtle">{announcement.category}</p>
        </div>

        <div className="md:col-span-9">
          <h2 className="font-display text-2xl leading-snug">
            {announcement.title}
          </h2>
          <p className="measure mt-3 text-sm leading-relaxed text-ink-muted">
            {announcement.body}
          </p>
          {announcement.attachments?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {announcement.attachments.map((attachment) => (
                <li key={attachment.href}>
                  <a
                    href={attachment.href}
                    className="inline-flex rounded-[var(--radius-control)] border border-line px-3 py-1.5 text-xs text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    {attachment.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}