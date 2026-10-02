import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Prose, Note, Stat } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

import { ACADEMICS } from "@/data/academics";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Academics",
  description: `The academic structure, languages and facilities of ${SITE.name}, Colombo.`,
};

export default function AcademicsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Academics"
        title="Grades 1 to 13 on the national curriculum"
        lede={ACADEMICS.system}
      />

      <Section className="pt-0">
        <Stagger className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
          {ACADEMICS.structure.map((band) => (
            <StaggerItem key={band.grades} className="bg-surface-raised p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                {band.band}
              </p>
              <p className="mt-3 font-display text-3xl">{band.grades}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {band.note}
              </p>
              {typeof band.enrolment === "number" ? (
                <p className="mt-6 border-t border-line pt-4 font-mono text-xs text-ink-subtle">
                  {band.enrolment.toLocaleString("en-LK")} students
                </p>
              ) : (
                <p className="mt-6 border-t border-line pt-4 font-mono text-xs text-ink-subtle">
                  {band.enrolment}
                </p>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="border-y border-line bg-surface-raised">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader
              eyebrow="Languages"
              title="Three languages, one entry rule"
              lede="Sinhala and Tamil are the media of instruction. English is taught as a language of study, and there is no direct admission to the English medium at entry stage."
            />
          </div>
          <div className="md:col-span-8">
            <Stagger className="space-y-px">
              {ACADEMICS.languages.map((language) => (
                <StaggerItem
                  key={language.name}
                  className="flex flex-col gap-2 border-t border-line bg-surface-raised py-6 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="font-display text-2xl">{language.name}</span>
                  <span className="text-sm text-ink-muted">{language.medium}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <Note tone="flagged" className="mt-8">
              The medium of instruction cannot be changed after admission. For
              bi-medium curricula, applications may be made under one medium only.
            </Note>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Facilities"
          title="What has been built, and when"
          lede="Most of the campus was added across six decades of particular principals' tenures."
        />
        <Stagger className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {ACADEMICS.facilities.map((facility) => (
            <StaggerItem key={facility.name}>
              <h3 className="font-display text-xl">{facility.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {facility.note}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="border-t border-line bg-surface-sunken">
        <SectionHeader
          eyebrow="Record"
          title="Results and recognition"
        />
        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
          {ACADEMICS.record.map((item) => (
            <StaggerItem key={item.scope} className="bg-surface-raised p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                {item.scope}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.detail}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeader
              eyebrow="To be confirmed"
              title="Not yet published"
              lede="These sit empty in the data rather than being filled with plausible guesses."
            />
          </div>
          <div className="md:col-span-7">
            <Prose>
              <div className="divide-y divide-line border-y border-line">
                {ACADEMICS.awaitingContent.map((item) => (
                  <div key={item} className="flex gap-4 py-4">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span className="text-sm text-ink-muted">{item}</span>
                  </div>
                ))}
              </div>
            </Prose>
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3">
              <Stat
                label="Total roll"
                value={SITE.enrolment.total.toLocaleString("en-LK")}
                detail="All students male"
              />
              <Stat
                label="Junior"
                value={SITE.enrolment.junior.toLocaleString("en-LK")}
                detail="Grades 1 to 5"
              />
              <Stat
                label="Senior"
                value={SITE.enrolment.senior.toLocaleString("en-LK")}
                detail="Grades 6 to 11"
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}