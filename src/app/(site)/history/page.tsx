import type { Metadata } from "next";
import Link from "next/link";
import { TIMELINE, CENTENARY_PROJECT } from "@/data/history";
import { ROUTES } from "@/constants/site";
import {
  PageHeader,
  Section,
  SectionHeader,
  Prose,
  Note,
} from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "History",
  description:
    "From a section of Ananda to a hundred years: how Nalanda College was founded in 1925 and what followed.",
};

const ERAS = [
  { id: "origins", label: "Origins, 1922 to 1925" },
  { id: "growth", label: "Growth" },
  { id: "centenary", label: "The centenary years" },
] as const;

export default function HistoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="History"
        title="From a section of Ananda to a hundred years"
        lede="The college began as a relocated section of another school, and was registered as Nalanda College on 1 November 1925."
      />

      {ERAS.map((era) => {
        const entries = TIMELINE.filter((entry) => entry.era === era.id);
        if (entries.length === 0) return null;

        return (
          <Section key={era.id}>
            <SectionHeader
              eyebrow={era.id === "centenary" ? "1925 to today" : "Timeline"}
              title={era.label}
            />

            <div className="mt-10 divide-y divide-line border-y border-line">
              {entries.map((entry) => (
                <div
                  key={`${entry.year}-${entry.title}`}
                  className="grid gap-3 py-8 sm:grid-cols-12 sm:gap-8"
                >
                  <p className="display-tight text-3xl sm:col-span-3">
                    {entry.year}
                  </p>
                  <div className="sm:col-span-9">
                    <h3 className="font-serif text-xl leading-snug">
                      {entry.title}
                    </h3>
                    <p className="measure mt-2 text-sm text-quiet-ink">
                      {entry.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      })}

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Origin"
              title="Patrick de Silva Kularatne and the sixteen classrooms"
            />
            <Prose className="mt-8">
              <p>
                The school traces to 1922, when a section of Ananda College was
                relocated to Campbell Place in Colombo at the proposal of the
                Buddhist educator Patrick de Silva Kularatne. L. H. Mettananda
                was appointed principal of what was then the Ananda branch, and
                the Governor of Ceylon laid the foundation stone for the new
                school in the same year.
              </p>
              <p>
                Kularatne spent Rs 5,500 to purchase 0.10 hectares near the
                Campbell Place playground and raised sixteen classrooms. Two went
                to the principal&apos;s office and staff, three to laboratories,
                and the remaining twelve to classes. Three hundred and thirty
                students transferred across from Ananda College in 1924.
              </p>
              <p>
                On 1 November 1925 the institution was registered as an
                independent school. Ananda Maitreya Thero proposed the name
                Nalanda, and Piyasena Malalasekara became its first registered
                principal. The assembly hall is now named the Malalasekara
                Theatre in his honour.
              </p>
            </Prose>
          </div>

          <div>
            <Card className="p-7">
              <p className="field">At a glance</p>
              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="text-quiet-ink">Founded</dt>
                  <dd className="mt-1">1 November 1925</dd>
                </div>
                <div>
                  <dt className="text-quiet-ink">First principal</dt>
                  <dd className="mt-1">Piyasena Malalasekara</dd>
                </div>
                <div>
                  <dt className="text-quiet-ink">Founder</dt>
                  <dd className="mt-1">Patrick de Silva Kularatne</dd>
                </div>
                <div>
                  <dt className="text-quiet-ink">Enrolment by 1926</dt>
                  <dd className="mt-1">550</dd>
                </div>
                <div>
                  <dt className="text-quiet-ink">Centenary</dt>
                  <dd className="mt-1">2025</dd>
                </div>
              </dl>
            </Card>

            <Button asChild className="mt-6">
              <Link href={ROUTES.pastPrincipals}>Past principals</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Second century"
          title="The works for the next hundred years"
          lede={CENTENARY_PROJECT.summary}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {CENTENARY_PROJECT.facilities.map((facility) => (
            <Card key={facility.name} className="p-7">
              <h3 className="font-serif text-xl">{facility.name}</h3>
              <p className="mt-3 text-sm text-quiet-ink">{facility.detail}</p>
            </Card>
          ))}
        </div>
        <Note className="mt-8 max-w-3xl">
          Project enquiries are directed through the Nalanda Centenary Project
          at{" "}
          <a href={`mailto:${CENTENARY_PROJECT.email}`} className="wipe text-brand">
            {CENTENARY_PROJECT.email}
          </a>
          .
        </Note>
      </Section>
    </>
  );
}