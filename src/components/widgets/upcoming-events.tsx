import Link from "next/link";
import { Widget, WidgetLink } from "@/components/widgets/widget";
import { CALENDAR_EVENTS } from "@/data/pastPrincipals";
import { getArticles } from "@/lib/content";
import { ROUTES } from "@/constants/site";
import { formatDate } from "@/lib/utils";

/**
 * The next dated events, filtered to those still ahead of the build.
 *
 * A server component on purpose, so the dates are in the static HTML and this
 * costs no client JavaScript. The trade-off is that the filter uses the build
 * date, not the visitor's date: once every event has passed the widget shows
 * nothing until the site is rebuilt. That matches how the rest of the site
 * behaves, since all of its content is baked in at build time. The client
 * countdown is the one widget that must stay live, and it says so.
 *
 * Comparisons are done on the date-only strings directly. `new Date(x)` would
 * parse these as UTC midnight, and a bare string compare avoids that whole
 * question.
 */
export function UpcomingEventsWidget({
  limit = 3,
  now = null,
}: {
  limit?: number;
  /**
   * The instant to measure against as an ISO string, or null to use the build
   * date. The /widgets route passes the shared value so every widget on the
   * page agrees on what "upcoming" means.
   */
  now?: string | null;
}) {
  const today = (now ?? new Date().toISOString()).slice(0, 10);
  const upcoming = CALENDAR_EVENTS.filter((e) => e.date >= today).slice(
    0,
    limit,
  );

  return (
    <Widget
      title="Coming up"
      eyebrow="Diary"
      action={<WidgetLink href={ROUTES.calendar}>Full dates</WidgetLink>}
    >
      {upcoming.length === 0 ? (
        <p className="text-sm text-quiet-ink">
          No dated events are listed. Term dates are confirmed by the Ministry
          of Education each year.
        </p>
      ) : (
        <ul className="grid gap-4">
          {upcoming.map((event) => (
            <li key={`${event.date}-${event.label}`} className="flex gap-4">
              <time
                dateTime={event.date}
                className="w-24 shrink-0 font-mono text-xs leading-6 text-brand"
              >
                {formatDate(event.date)}
              </time>
              <span className="text-sm">
                <span className="block">{event.label}</span>
                <span className="field mt-0.5 block text-xs">{event.kind}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Widget>
  );
}

/**
 * Compact headline list.
 *
 * `/news` already covers this with category filtering, so this is deliberately
 * a shorter read rather than a second copy of that page: three headlines, no
 * filters, no thumbnails.
 */
export async function LatestNewsWidget({ limit = 3 }: { limit?: number }) {
  const articles = await getArticles();
  const stories = [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);

  return (
    <Widget
      title="Latest news"
      eyebrow="Recent"
      action={<WidgetLink href={ROUTES.news}>All news</WidgetLink>}
    >
      <ul className="grid gap-4">
        {stories.map((article) => (
          <li key={article.slug}>
            <Link
              href={`${ROUTES.news}/${article.slug}`}
              className="text-sm underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-brand hover:underline"
            >
              {article.title}
            </Link>
            <span className="field mt-1 block text-xs">
              {article.category} &#183; {formatDate(article.publishedAt)}
            </span>
          </li>
        ))}
      </ul>
    </Widget>
  );
}