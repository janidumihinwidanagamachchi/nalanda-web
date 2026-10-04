import Link from "next/link";
import { Widget, WidgetLink } from "@/components/widgets/widget";
import { isExpired } from "@/data/announcements";
import { getAnnouncements } from "@/lib/content";
import { ROUTES } from "@/constants/site";
import { formatDate } from "@/lib/utils";

/**
 * Notices that need saying now: pinned first, then anything urgent.
 *
 * Expiry is evaluated against the build date, for the same reason as the
 * upcoming-events widget: this is a server component, so "now" is the build.
 * A notice that lapses later stays listed until the next rebuild. The full
 * board on /announcements re-evaluates in the browser and will drop it, so the
 * two can disagree for a while — the ticker is the one that errs toward
 * showing something that has since closed, which is the safer direction to be
 * wrong in for a deadline.
 */
export async function AnnouncementTickerWidget({
  limit = 4,
  now = null,
}: {
  limit?: number;
  now?: string | null;
}) {
  const announcements = await getAnnouncements();
  const today = new Date(now ?? new Date().toISOString());
  const live = announcements.filter((a) => !isExpired(a, today))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.severity !== b.severity) {
        return a.severity === "urgent" ? -1 : 1;
      }
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, limit);

  if (live.length === 0) {
    return (
      <Widget title="Notices" eyebrow="Announcements">
        <p className="text-sm text-quiet-ink">
          There are no current notices. Anything urgent is posted to the{" "}
          <Link href={ROUTES.announcements} className="wipe text-brand">
            announcements page
          </Link>
          .
        </p>
      </Widget>
    );
  }

  return (
    <Widget
      title="Notices"
      eyebrow="Announcements"
      action={<WidgetLink href={ROUTES.announcements}>All notices</WidgetLink>}
    >
      <ul className="grid gap-3">
        {live.map((notice) => (
          <li key={notice.id} className="border-l-2 border-brand pl-3">
            <Link
              href={ROUTES.announcements}
              className="text-sm underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-brand hover:underline"
            >
              {notice.title}
            </Link>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={
                  notice.severity === "urgent"
                    ? "text-brand"
                    : "text-quiet-ink"
                }
              >
                {notice.severity}
              </span>
              <span className="field">{notice.category}</span>
              {notice.expiresAt ? (
                <span className="field">
                  closes {formatDate(notice.expiresAt)}
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </Widget>
  );
}