import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { EXTRA_CURRICULAR_NOTES, SPORTS } from "@/data/extraCurricular";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Sport",
  description: `Sport at ${SITE.name}, Colombo: a centenary of competing, from the cadet band to the Battle of the Maroons.`,
};

const FIXTURES = [
  { name: "Swimming Fiesta", date: "10 September 2026" },
  { name: "Rugby Fiesta", date: "Centenary programme" },
  { name: "Boxing Fiesta", date: "Centenary programme" },
] as const;

export default function SportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Extra Curricular"
        title="Sport"
        lede="A centenary of sporting excellence, and a facilities record that runs from a swimming pool to a new arena."
      />

      <Section className="pt-0">
        <div className="divide-y divide-line border-y border-line">
          {SPORTS.map((sport, index) => (
            <article
              key={sport.name}
              className="grid gap-4 py-10 md:grid-cols-12 md:gap-8"
            >
              <p className="font-mono text-xs text-quiet-ink md:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="md:col-span-7">
                <h2 className="font-serif text-2xl md:text-3xl">{sport.name}</h2>
                <p className="measure mt-3 text-base text-quiet-ink">
                  {sport.detail}
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                {sport.link ? (
                  <a
                    href={sport.link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-sm text-brand"
                  >
                    {sport.link.label}
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className="text-sm text-quiet-ink">
                    No public page
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Centenary fixtures"
          title="The centenary sports programme"
          lede="The centenary sports programme is organised with the Old Nalandians' Sports Club, established in 1967."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FIXTURES.map((fixture) => (
            <Card key={fixture.name} className="p-7">
              <h3 className="font-serif text-xl">{fixture.name}</h3>
              <p className="field mt-3">{fixture.date}</p>
            </Card>
          ))}
        </div>

        <Note tone="flagged" className="mt-12 max-w-3xl">
          {EXTRA_CURRICULAR_NOTES.sports}
        </Note>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={ROUTES.extraCurricular}
            className="wipe text-sm text-brand"
          >
            Back to extra curricular
          </Link>
        </div>
      </Section>
    </>
  );
}