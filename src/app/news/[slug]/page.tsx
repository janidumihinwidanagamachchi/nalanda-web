import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { MaskedText } from "@/components/motion/masked-text";
import { ARTICLES } from "@/data/news";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
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
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const others = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <article>
      <header className="shell pt-16 pb-12 md:pt-24">
        <Link
          href={ROUTES.news}
          className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          All news
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-[2px] border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
            {article.category}
          </span>
          <time
            dateTime={article.publishedAt}
            className="font-mono text-xs text-ink-subtle"
          >
            {new Date(article.publishedAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span className="font-mono text-xs text-ink-subtle">
            {article.readMinutes} min read
          </span>
        </div>

<MaskedText
          as="h1"
          text={article.title}
          animateOnMount
          className="display-tight mt-6 max-w-4xl text-4xl md:text-5xl"
        />
      </header>

      <div className="rule" />

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="sticky top-24 text-xs uppercase tracking-[0.14em] text-ink-subtle">
              {SITE.name}
            </p>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <Reveal>
              <div className="space-y-6">
                {article.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="text-lg leading-relaxed text-ink-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line bg-surface-sunken">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
          More news
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {others.map((other) => (
            <Reveal key={other.slug}>
              <Link
                href={`/news/${other.slug}`}
                className="group block border-t border-line pt-5"
              >
                <p className="font-mono text-xs text-ink-subtle">
                  {new Date(other.publishedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-2 font-display text-lg leading-snug">
                  {other.title}
                </h3>
                <p className="mt-4 text-sm text-ink-muted transition-colors group-hover:text-accent">
                  Read
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </article>
  );
}