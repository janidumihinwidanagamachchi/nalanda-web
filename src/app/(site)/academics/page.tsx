import type { Metadata } from "next";
import { ACADEMICS } from "@/data/academics";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Grades 1 to 13 on the national curriculum: structure, languages of instruction, facilities and academic record.",
};

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="Grades 1 to 13 on the national curriculum"
        lede={`Nalanda teaches within the ${ACADEMICS.system}, across three bands on one campus.`}
      />

      <Section>
        <SectionHeader eyebrow="Structure" title="Three bands, one campus" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {ACADEMICS.structure.map((band) => (
            <Card key={band.band} className="p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-xl">{band.band}</h3>
                <span className="font-mono text-xs text-quiet-ink">
                  {band.grades}
                </span>
              </div>
              <p className="display-tight mt-4 text-3xl">
                {typeof band.enrolment === "number"
                  ? band.enrolment.toLocaleString()
                  : "—"}
              </p>
              <p className="mt-1 text-sm text-quiet-ink">students</p>
              <p className="mt-4 text-sm text-quiet-ink">{band.note}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Language"
              title="Three languages of instruction"
            />
            <div className="mt-8 divide-y divide-line border-y border-line">
              {ACADEMICS.languages.map((language) => (
                <div key={language.name} className="py-5">
                  <p className="font-serif text-lg">{language.name}</p>
                  <p className="mt-1 text-sm text-quiet-ink">{language.medium}</p>
                </div>
              ))}
            </div>
            <Note tone="flagged" className="mt-8">
              There are no direct admissions to the English medium at entry
              stage. Entry is limited to the Sinhala and Tamil mediums.
            </Note>
          </div>

          <div>
            <SectionHeader eyebrow="Record" title="What the college has won" />
            <div className="mt-8 divide-y divide-line border-y border-line">
              {ACADEMICS.record.map((entry) => (
                <div key={entry.scope} className="py-5">
                  <p className="field">{entry.scope}</p>
                  <p className="mt-2 text-sm">{entry.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Facilities"
          title="What is on the site"
          lede="Built in stages, and recorded here with the tenure each addition belongs to."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ACADEMICS.facilities.map((facility) => (
            <Card key={facility.name} className="p-6">
              <h3 className="font-serif text-base leading-snug">
                {facility.name}
              </h3>
              <p className="mt-3 text-sm text-quiet-ink">{facility.note}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Outstanding" title="Not published" />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {ACADEMICS.awaitingContent.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-dashed border-field px-4 py-3 text-sm text-quiet-ink"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}