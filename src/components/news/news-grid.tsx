"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  NEWS_CATEGORIES,
  type NewsCategory,
  type ResolvedArticle,
} from "@/data/news";
import { useUrlFilter } from "@/lib/use-url-filter";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Card } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

/**
 * The stories, handed down rather than imported.
 *
 * A client component cannot await a build-time database read, so the server page
 * resolves the articles and passes them in. Each already carries its resolved
 * thumbnail, which is why this no longer calls `thumbFor`.
 */
export function NewsGrid({ articles }: { articles: ResolvedArticle[] }) {
  const [filter, setFilter] = useUrlFilter<NewsCategory | "All">(
    "category",
    ["All", ...NEWS_CATEGORIES],
    "All",
  );

  const shown =
    filter === "All"
      ? articles
      : articles.filter((a) => a.category === filter);

  return (
    <div>
      <FilterTabs
        options={["All", ...NEWS_CATEGORIES] as const}
        value={filter}
        onChange={setFilter}
        label="Filter news by category"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {shown.map((article) => (
          <Card key={article.slug} className="group">
            <Link
              href={`/news/${article.slug}`}
              className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-t-xl">
                {/*
                  `alt=""` deliberately: the headline sits directly beneath this
                  image and already says what the frame is for, so describing
                  the picture too would read the same sentence aloud twice.
                */}
                <Image
                  src={article.thumb.src}
                  alt=""
                  width={article.thumb.width}
                  height={article.thumb.height}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">{article.category}</Badge>
                  <time
                    dateTime={article.publishedAt}
                    className="font-mono text-xs text-quiet-ink"
                  >
                    {formatDate(article.publishedAt)}
                  </time>
                  <span className="font-mono text-xs text-quiet-ink">
                    {article.readMinutes} min
                  </span>
                </div>

                <h2 className="mt-4 font-serif text-2xl leading-snug">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm text-quiet-ink">{article.excerpt}</p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand">
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
      </div>
    </div>
  );
}