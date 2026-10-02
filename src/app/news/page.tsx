import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Section } from "@/components/ui/section";
import { NewsGrid } from "@/components/news/news-grid";
import { GridSkeleton } from "@/components/ui/skeleton";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "News",
  description: `Achievements and school news from ${SITE.name}, Colombo.`,
};

export default function NewsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="News"
        title="Achievements and school news"
        lede="Published by the college, split between competitive and academic achievement and the ordinary business of the school."
      />
      <Section className="pt-0">
        <Suspense fallback={<GridSkeleton />}>
          <NewsGrid />
        </Suspense>
      </Section>
    </div>
  );
}