import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { EXTRA_CURRICULAR_NOTES, SPORTS } from "@/data/extraCurricular";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Sports",
  description: `Sport at ${SITE.name}, Colombo, from the cadet band to the centenary rugby fiesta.`,
};

export default function SportsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Extra Curricular"
        title="Sport"
        lede="A centenary of sporting excellence, and a facilities record that runs from a swimming pool to a new arena."
      />

      <Section className="pt-0">
        <div className="divide-y divide-line border-y border-line">
          {SPORTS.map((sport, index) => (
            <Reveal key={sport.name} distance={20}>
              <article className="grid gap-4 py-10 md:grid-cols-12 md:gap-8">
                <p className="font-mono text-xs text-ink-subtle md:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="md:col-span-4">
                  <SplitText
                    text={sport.name}
                    className="font-display text-2xl md:text-3xl"
                  />
                </div>
                <div className="md:col-span-6">
                  <p className="text-base leading-relaxed text-ink-muted">
                    {sport.detail}
                  </p>
                  {sport.link ? (
                    <a
                      href={sport.link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent"
                    >
                      {sport.link.label}
                      <span aria-hidden>→</span>
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-y border-line bg-surface-raised">
        <SectionHeader
          eyebrow="Centenary fixtures"
          title="The centenary sports programme"
          lede="The centenary sports programme is organised with the Old Nalandians' Sports Club, established in 1967."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { name: "Swimming Fiesta", date: "10 September 2026" },
            { name: "Rugby Fiesta", date: "Centenary programme" },
            { name: "Boxing Fiesta", date: "Centenary programme" },
          ].map((fixture) => (
            <Reveal key={fixture.name}>
              <div className="border-t border-line pt-5">
                <h3 className="font-display text-xl">{fixture.name}</h3>
                <p className="mt-2 font-mono text-xs text-ink-subtle">
                  {fixture.date}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Note tone="flagged" className="max-w-3xl">
          {EXTRA_CURRICULAR_NOTES.sports}
        </Note>
      </Section>
    </div>
  );
}