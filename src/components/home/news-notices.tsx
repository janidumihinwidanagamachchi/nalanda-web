import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { isExpired } from "@/data/announcements";
import { getAnnouncements, getArticles } from "@/lib/content";
import { ROUTES } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";

/**
 * The three most recent stories beside the live announcements.
 *
 * Split rather than interleaved because the two answer different questions: a
 * parent wants to know what is happening now, a visitor wants to know what the
 * college has done. Both are time-ordered independently.
 */
export async function NewsNotices() {
  const [announcements, articles] = await Promise.all([
    getAnnouncements(),
    getArticles(),
  ]);

  // A server component, and its markup is prerendered (out/index.html contains
  // these dates). So this is the build instant and never re-runs in a browser.
  // Unlike the client-only announcements board, nothing here can be re-evaluated
  // per visit, so a notice that lapses stays on the home page until the site is
  // rebuilt. Keeping the two behaviours in mind is the point: prefer the client
  // mount when the markup is client-only, and accept build-time staleness only
  // where the markup demands it.
  const today = new Date();
  const live = announcements.filter((a) => !isExpired(a, today))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, 3);

  const stories = [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <section className="shell py-16 md:py-24">
      <SectionHeader
        eyebrow="News and notices"
        title="Achievements and school news"
        lede="What the college has done, and what it needs you to know this week."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
        <div className="grid gap-6">
          {stories.map((article) => (
            <Card key={article.slug} className="group">
              <Link
                href={`/news/${article.slug}`}
                className="grid gap-6 rounded-xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:grid-cols-[12rem_1fr] sm:p-6"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg border">
                  <Image
                    src={article.thumb.src}
                    alt=""
                    width={article.thumb.width}
                    height={article.thumb.height}
                    sizes="(max-width: 640px) 100vw, 12rem"
                    className="size-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{article.category}</Badge>
                    <time
                      dateTime={article.publishedAt}
                      className="font-mono text-xs text-quiet-ink"
                    >
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mt-3 font-serif text-xl leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-quiet-ink">{article.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand">
                    Read
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-[var(--motion-base)] group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Card>
          ))}

          <Button asChild variant="outline" className="justify-self-start">
            <Link href={ROUTES.news}>
              All news
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="field">Announcements</h3>
            <Link
              href={ROUTES.announcements}
              className="wipe text-sm text-brand"
            >
              All
            </Link>
          </div>

          <div className="mt-5 grid gap-4">
            {live.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-xl border bg-panel p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={announcement.severity === "urgent" ? "danger" : "outline"}
                  >
                    {announcement.severity}
                  </Badge>
                  {announcement.pinned ? (
                    <Badge variant="secondary">Pinned</Badge>
                  ) : null}
                </div>
                <h4 className="mt-3 font-serif text-base leading-snug">
                  {announcement.title}
                </h4>
                <p className="mt-2 text-sm text-quiet-ink">
                  {announcement.body}
                </p>
              </article>
            ))}
            {live.length === 0 ? (
              <p className="rounded-xl border bg-panel px-5 py-8 text-center text-sm text-quiet-ink">
                No current announcements.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}