import type { Metadata } from "next";
import { ADMISSIONS_NOTES, GRADE_ONE, INTERMEDIATE_AND_OTHER, SEAT_ALLOCATION } from "@/data/admissions";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

/** The admissions timeline spells the month out, unlike the rest of the site. */
const timelineDate = (iso: string) => formatDate(iso, { month: "long" });

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "How entry to Nalanda works: Grade 1 applications under Circular 25/2026, intermediate vacancies under Circular 09/2026, seat allocation and deadlines.",
};

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admissions"
        title="How entry to Nalanda works"
        lede="Two circulars govern admission: one for Grade 1, one for vacancies in intermediate grades. Both are set by the Ministry of Education, not by the school."
      />

      <Section>
        <SectionHeader
          eyebrow="Grade 1"
          title={`Circular ${GRADE_ONE.circular}`}
          lede={`Issued by the ${GRADE_ONE.issuedBy} for intake year ${GRADE_ONE.year}.`}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="p-7">
            <Badge variant="secondary">Eligibility</Badge>
            <p className="mt-4 text-sm">{GRADE_ONE.ageRule}.</p>
            <p className="mt-4 text-sm text-quiet-ink">{GRADE_ONE.ageHardStop}</p>
          </Card>
          <Card className="p-7">
            <Badge variant="secondary">Documents</Badge>
            <ul className="mt-4 grid gap-3 text-sm">
              {GRADE_ONE.documents.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-quiet-ink">
              Documents must be valid to {timelineDate(GRADE_ONE.timeline[0].date)}.
            </p>
          </Card>
          <Card className="p-7">
            <Badge variant="secondary">Method</Badge>
            <ol className="mt-4 grid gap-3 text-sm">
              {GRADE_ONE.method.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="font-mono text-xs text-quiet-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-7">
            <p className="field">Medium of instruction</p>
            <p className="mt-4 text-sm">{GRADE_ONE.mediumRule}</p>
            <p className="mt-4 text-sm text-quiet-ink">{GRADE_ONE.mediumLock}</p>
          </Card>
          <Card className="p-7">
            <p className="field">Integrity</p>
            <p className="mt-4 text-sm">{GRADE_ONE.integrity}</p>
          </Card>
        </div>

        <div className="mt-10">
          <h3 className="field">Timeline for Grade 1</h3>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {GRADE_ONE.timeline.map((step) => (
              <div
                key={step.date}
                className="grid gap-2 py-5 sm:grid-cols-12 sm:gap-8"
              >
                <p className="font-mono text-xs text-brand sm:col-span-4">
                  {timelineDate(step.date)}
                </p>
                <div className="sm:col-span-8">
                  <p className="font-medium">{step.label}</p>
                  <p className="mt-1 text-sm text-quiet-ink">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Note className="mt-8 max-w-3xl">
          {GRADE_ONE.unsuccessful}
        </Note>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Seat allocation"
          title="How seats are divided"
          lede="Published allocation, applied after application and preference."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEAT_ALLOCATION.map((seat) => (
            <Card key={seat.label} className="p-6">
              <p className="display-tight text-4xl">{seat.share}%</p>
              <p className="mt-2 text-sm">{seat.label}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Intermediate grades"
          title={`Circular ${INTERMEDIATE_AND_OTHER.circular}`}
          lede={`${INTERMEDIATE_AND_OTHER.scope}. ${INTERMEDIATE_AND_OTHER.vacancyBasis}.`}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="p-7">
            <p className="field">Maximum class strength</p>
            <ul className="mt-5 divide-y divide-line">
              {INTERMEDIATE_AND_OTHER.capacities.map((capacity) => (
                <li
                  key={capacity.grades}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <span className="text-sm">{capacity.grades}</span>
                  <span className="font-mono text-sm">{capacity.max}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-7">
            <p className="field">Eligibility</p>
            <ul className="mt-5 grid gap-2 text-sm">
              {INTERMEDIATE_AND_OTHER.eligibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-10">
          <h3 className="field">Timeline</h3>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {INTERMEDIATE_AND_OTHER.timeline.map((step) => (
              <div
                key={step.date}
                className="grid gap-2 py-5 sm:grid-cols-12 sm:gap-8"
              >
                <p className="font-mono text-xs text-brand sm:col-span-4">
                  {timelineDate(step.date)}
                </p>
                <div className="sm:col-span-8">
                  <p className="font-medium">{step.label}</p>
                  <p className="mt-1 text-sm text-quiet-ink">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <Note className="max-w-3xl">
          {ADMISSIONS_NOTES.applicationLanguage} {ADMISSIONS_NOTES.enquiry}
        </Note>
      </Section>
    </>
  );
}