import type { Metadata } from "next";
import Link from "next/link";
import { CENTENARY_PROJECT } from "@/data/history";
import { PageHeader, Section, SectionHeader, Prose } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Centenary",
  description:
    "A hundred years, and the works for the next hundred: the Nalanda Centenary Project, its Innovation Center and Sports Arena.",
};

export default function CentenaryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Centenary"
        title="A hundred years, and the works for the next hundred"
        lede={CENTENARY_PROJECT.summary}
      />

      <Section>
        <SectionHeader
          eyebrow="The project"
          title={CENTENARY_PROJECT.name}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {CENTENARY_PROJECT.facilities.map((facility) => (
            <Card key={facility.name} className="p-8">
              <Badge variant="secondary">Facility</Badge>
              <h3 className="mt-4 font-serif text-2xl">{facility.name}</h3>
              <p className="mt-4 text-sm text-quiet-ink">{facility.detail}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <SectionHeader eyebrow="Milestones" title="How the project began" />
            <div className="mt-10 divide-y divide-line border-y border-line">
              {CENTENARY_PROJECT.milestones.map((milestone) => (
                <div
                  key={milestone.date}
                  className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-8"
                >
                  <p className="font-mono text-xs text-brand sm:col-span-4">
                    {formatDate(milestone.date, { month: "long" })}
                  </p>
                  <div className="sm:col-span-8">
                    <p className="font-medium">{milestone.label}</p>
                    <p className="mt-1 text-sm text-quiet-ink">
                      {milestone.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Card className="p-7">
              <p className="field">Enquiries</p>
              <p className="mt-4 text-sm">
                Project enquiries are directed to the Centenary Project office.
              </p>
              <div className="mt-6 grid gap-3 text-sm">
                <a
                  href={`mailto:${CENTENARY_PROJECT.email}`}
                  className="wipe text-brand"
                >
                  {CENTENARY_PROJECT.email}
                </a>
                <a
                  href={CENTENARY_PROJECT.site}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="wipe text-brand"
                >
                  {CENTENARY_PROJECT.site.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </Card>

            <Card className="mt-6 p-7">
              <p className="field">Programme</p>
              <Prose className="mt-4">
                <p>
                  The centenary programme extends beyond the two buildings: the
                  Centennial Rugby Fiesta, Boxing Fiesta and Swimming Fiesta were
                  all held as part of it, organised with the Old Nalandians&apos;
                  Sports Club.
                </p>
              </Prose>
              <Button asChild variant="outline" className="mt-6">
                <Link href={ROUTES.history}>Read the history</Link>
              </Button>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}