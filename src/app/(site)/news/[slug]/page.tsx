import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/panel";
import { getArticles } from "@/lib/content";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";
import { formatDate } from "@/lib/utils";

/**
 * The set of prerendered story pages.
 *
 * This is the reason content lives in a database but still ships as static HTML:
 * `generateStaticParams` decides which `/news/[slug]` pages exist in `out/`, and
 * it runs at build time. A story added in the panel gets a page on the next
 * rebuild, which is what the publish webhook exists to trigger.
 */
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "News" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <article>
      <PageHeader eyebrow="News" title={article.title}>
        <Link
          href={ROUTES.news}
          className="inline-flex items-center gap-2 text-sm text-quiet-ink transition-colors duration-[var(--motion-fast)] hover:text-brand"
        >
          <ArrowLeft size={16} />
          All news
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Badge variant="secondary">{article.category}</Badge>
          <time
            dateTime={article.publishedAt}
            className="font-mono text-xs text-quiet-ink"
          >
            {formatDate(article.publishedAt, { month: "long" })}
          </time>
          <span className="font-mono text-xs text-quiet-ink">
            {article.readMinutes} min read
          </span>
        </div>
      </PageHeader>

      <Section className="pt-0">
        <figure className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-alt">
          <Image
            src={article.thumb.src}
            alt=""
            width={article.thumb.width}
            height={article.thumb.height}
            priority
            sizes="100vw"
            className="size-full object-cover"
          />
        </figure>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="field md:sticky md:top-24">{SITE.name}</p>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <p className="measure text-lg leading-relaxed text-quiet-ink">
              {article.excerpt}
            </p>
            <div className="measure mt-8 grid gap-6 text-base">
              {article.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="More news" title="Other published items" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {others.map((other) => (
            <Card key={other.slug} className="group">
              <Link
                href={`/news/${other.slug}`}
                className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <div className="p-6">
                  <p className="font-mono text-xs text-quiet-ink">
                    {formatDate(other.publishedAt)}
                  </p>
                  <h3 className="mt-3 font-serif text-lg leading-snug">
                    {other.title}
                  </h3>
                  {/*
                    The hover state deepens the maroon rather than flipping to
                    brand-ink, which would put white text on a white panel.
                  */}
                  <span className="mt-4 inline-block text-sm text-brand underline underline-offset-4 transition-colors duration-[var(--motion-fast)] group-hover:text-ink">
                    Read
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </article>
  );
}