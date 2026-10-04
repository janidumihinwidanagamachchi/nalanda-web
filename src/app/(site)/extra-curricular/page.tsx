import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Prose, Stat } from "@/components/ui/section";
import { LinkCard } from "@/components/ui/card";
import { Card } from "@/components/ui/panel";
import { ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";
import {
  SOCIETIES,
  SPORTS,
  EXTRA_CURRICULAR_NOTES,
} from "@/data/extraCurricular";

export const metadata: Metadata = {
  title: "Extra Curricular",
  description: `Clubs, societies and sport outside the classroom at ${SITE.name}, Colombo.`,
};

const GROUPS = [
  "Media and Arts",
  "Science and Technology",
  "Academic",
  "Culture and Service",
] as const;

export default function ExtraCurricularPage() {
  return (
    <>
      <PageHeader
        eyebrow="Extra Curricular"
        title="What happens outside the classroom"
        lede={`${SOCIETIES.length} societies, a sporting tradition running from the cadet band to the centenary rugby fiesta, and clubs the college has yet to publish.`}
      />

      <Section className="pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          <LinkCard
            title="Clubs"
            meta="To be published"
            body={EXTRA_CURRICULAR_NOTES.clubs}
            href={ROUTES.clubs}
          />
          <LinkCard
            title="Societies"
            meta={`${SOCIETIES.length} listed`}
            body="Media, science, academic and cultural societies, each with its own page and programme."
            href={ROUTES.societies}
          />
          <LinkCard
            title="Sports"
            meta={`${SPORTS.length} recorded`}
            body="From the Western Cadet Band to boxing, aquatics, rugby, athletics, badminton and squash."
            href={ROUTES.sports}
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Societies in brief"
              title="Four groups"
              lede="The college's societies, sorted into the broad areas they work in."
            />
            <div className="mt-10 divide-y divide-line border-y border-line">
              {GROUPS.map((group) => {
                const members = SOCIETIES.filter((s) => s.group === group);
                return (
                  <div
                    key={group}
                    className="flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="text-sm">{group}</span>
                    <span className="font-mono text-lg tabular-nums text-quiet-ink">
                      {String(members.length).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
            <Prose className="mt-10">
              <p>
                {EXTRA_CURRICULAR_NOTES.societies}
              </p>
            </Prose>
          </div>

          <div className="grid content-start gap-6">
            <Card className="p-7">
              <Stat
                label="Societies"
                value={SOCIETIES.length}
                detail="Listed by the college"
              />
            </Card>
            <Card className="p-7">
              <Stat label="Sports" value={SPORTS.length} detail="Recorded on this site" />
            </Card>
            <Card className="p-7">
              <Stat
                label="Clubs"
                value="—"
                detail="The college publishes an empty clubs page"
              />
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <p className="display-tight max-w-4xl text-3xl md:text-4xl">
          A century in, the cadet band reclaimed a national title after twenty-five
          years, and the Astronomical Society has run more than two hundred night
          camps.
        </p>
      </Section>
    </>
  );
}