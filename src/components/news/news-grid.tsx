"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { DURATION, EASE, SPRING } from "@/constants/motion";
import { ARTICLES, NEWS_CATEGORIES, type NewsCategory } from "@/data/news";
import { thumbFor } from "@/data/media";

export function NewsGrid() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<NewsCategory | "All">("All");

  const shown =
    filter === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === filter);

  return (
    <div>
      <div
        className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0"
        role="tablist"
        aria-label="Filter news"
      >
        {(["All", ...NEWS_CATEGORIES] as const).map((category) => {
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
                  layoutId="news-filter"
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

      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((article, index) => (
            <motion.article
              key={article.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{
                duration: DURATION.modal,
                delay: reduce ? 0 : index * 0.06,
                ease: EASE.strongOut,
              }}
            >
              <Link href={`/news/${article.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-sunken">
                  <motion.div
                    className="h-full w-full"
                    whileHover={reduce ? undefined : { scale: 1.04 }}
                    transition={{ duration: 0.6, ease: EASE.strongOut }}
                  >
                    <Image
                      src={thumbFor(article.slug)}
                      alt=""
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <span className="rounded-[2px] border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
                    {article.category}
                  </span>
                  <time
                    dateTime={article.publishedAt}
                    className="font-mono text-xs text-ink-subtle"
                  >
                    {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <span className="font-mono text-xs text-ink-subtle">
                    {article.readMinutes} min
                  </span>
                </div>

                <h2 className="mt-3 font-display text-2xl leading-snug">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {article.excerpt}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink transition-colors group-hover:text-accent">
                  Read
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}