import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { CountUp } from "@/components/motion/count-up";
import {
  ADMISSIONS_NOTES,
  GRADE_ONE,
  INTERMEDIATE_AND_OTHER,
  SEAT_ALLOCATION,
} from "@/data/admissions";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Admissions",
  description: `Admissions to ${SITE.name}, Colombo, under Ministry Circulars 25/2026 and 09/2026.`,
};

export default function AdmissionsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Admissions"
        title="How entry to Nalanda works"
        lede="Admissions to national schools in Sri Lanka are set by Ministry circular, not by the individual school. Everything below is what those circulars require."
      >
        <div className="flex flex-wrap gap-3">
          <MagneticButton href={ROUTES.announcements} variant="solid">
            Current notices
          </MagneticButton>
          <MagneticButton href={ROUTES.downloads} variant="outline">
            Circulars and papers
          </MagneticButton>
        </div>
      </PageHeader>

      <Section className="pt-0">
        <Stagger className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
          <StaggerItem className="bg-surface-raised p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
              Grade 1, {GRADE_ONE.year}
            </p>
            <p className="mt-3 font-display text-3xl">{GRADE_ONE.circular}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {GRADE_ONE.ageRule}. Applications by registered post only, to at
              least six schools, closing 30 July 2026.
            </p>
          </StaggerItem>
          <StaggerItem className="bg-surface-raised p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
              Intermediate and other grades
            </p>
            <p className="mt-3 font-display text-3xl">{INTERMEDIATE_AND_OTHER.circular}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {INTERMEDIATE_AND_OTHER.scope}. Vacancies calculated as at 31 January
              2026, all admissions complete before 27 April 2026.
            </p>
          </StaggerItem>
        </Stagger>
      </Section>

      <Section className="border-y border-line bg-surface-sunken">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader
              eyebrow={`Grade 1, ${GRADE_ONE.year}`}
              title="The admission year"
            />
            <Reveal className="mt-8">
              <ul className="space-y-3 text-sm leading-relaxed text-ink-muted">
                <li className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {GRADE_ONE.ageRule}
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {GRADE_ONE.ageHardStop}
                </li>
                {GRADE_ONE.method.map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {rule}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Timeline title="Grade 1 timeline" entries={GRADE_ONE.timeline} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader
              eyebrow="Seat allocation"
              title="How a place is allocated"
              lede="Places are allocated across six categories by fixed percentages. Applying to more schools does not increase your chances within a category."
            />
          </div>
          <div className="md:col-span-8">
            <Stagger className="space-y-7">
              {SEAT_ALLOCATION.map((category) => (
                <StaggerItem key={category.label}>
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="text-base">{category.label}</span>
                    <span className="font-mono text-lg tabular-nums">
                      <CountUp value={category.share} suffix="%" duration={1.1} />
                    </span>
                  </div>
                  <div
                    className="mt-2.5 h-1 w-full bg-line"
                    role="presentation"
                    aria-hidden
                  >
                    <div
                      className="h-full origin-left bg-accent"
                      style={{ width: `${category.share}%` }}
                    />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      <Section className="border-y border-line bg-surface-raised">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader eyebrow="Documents" title="What to send" />
            <Reveal className="mt-8">
              <ul className="space-y-3 text-sm leading-relaxed text-ink-muted">
                {GRADE_ONE.documents.map((doc) => (
                  <li key={doc} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {doc}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Timeline
              title={`${INTERMEDIATE_AND_OTHER.circular} timeline`}
              entries={INTERMEDIATE_AND_OTHER.timeline}
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeader
              eyebrow="Intermediate grades"
              title="Class capacities and eligibility"
            />
            <div className="mt-10 divide-y divide-line border-y border-line">
              {INTERMEDIATE_AND_OTHER.capacities.map((capacity) => (
                <div
                  key={capacity.grades}
                  className="flex items-baseline justify-between py-5"
                >
                  <span className="text-sm text-ink-muted">{capacity.grades}</span>
                  <span className="font-mono text-lg">
                    <CountUp value={capacity.max} />
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-subtle">
              Maximum students per class. Vacancies exist only where strength is below
              the limit.
            </p>
          </div>
          <div className="md:col-span-7">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
              Who is eligible
            </h3>
            <Stagger className="mt-6 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
              {INTERMEDIATE_AND_OTHER.eligibility.map((item) => (
                <StaggerItem key={item} className="bg-surface-raised px-6 py-5">
                  <p className="text-sm">{item}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <Note tone="flagged" className="mt-8">
              {GRADE_ONE.mediumRule}
            </Note>
            <Note tone="flagged" className="mt-4">
              {GRADE_ONE.integrity}
            </Note>
            <Note className="mt-4">
              {GRADE_ONE.unsuccessful}
            </Note>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line bg-surface-sunken">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SplitText
              text={ADMISSIONS_NOTES.intakes}
              className="display-tight text-3xl md:text-4xl"
            />
          </div>
          <div className="md:col-span-7">
            <p className="measure text-base leading-relaxed text-ink-muted">
              {ADMISSIONS_NOTES.applicationLanguage}
            </p>
            <p className="measure mt-4 text-base leading-relaxed text-ink-muted">
              {ADMISSIONS_NOTES.enquiry} The office is at {SITE.address.street},{" "}
              {SITE.address.locality}, and can be reached on {SITE.contact.phoneDisplay}.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

type TimelineEntry = { date: string; label: string; detail: string };

function Timeline({ title, entries }: { title: string; entries: readonly TimelineEntry[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
        {title}
      </h3>
      <ol className="mt-6 border-t border-line">
        {entries.map((entry) => (
          <li key={entry.date}>
            <Reveal distance={16}>
              <div className="grid gap-2 border-b border-line py-5 sm:grid-cols-12 sm:gap-6">
                <p className="font-mono text-xs tracking-[0.1em] text-accent sm:col-span-4">
                  {entry.date}
                </p>
                <div className="sm:col-span-8">
                  <p className="font-medium">{entry.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {entry.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}