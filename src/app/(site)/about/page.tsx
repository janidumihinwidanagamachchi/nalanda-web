import type { Metadata } from "next";
import { SITE, STATS, NEEDS_SUPPLY } from "@/data/site";
import { ROUTES } from "@/constants/site";
import { PageHeader, Section, SectionHeader, Prose, Stat } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About the College",
  description: `${SITE.name} is a national school in ${SITE.place}, founded in ${SITE.establishedYear}. Its vision, mission and motto.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="What the college sets out to do"
        lede={`${SITE.type} for ${SITE.gender.toLowerCase()}s, in the ${SITE.address.zone} of the ${SITE.address.division}, affiliated with the ${SITE.affiliation}.`}
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="p-6">
              <Stat label={stat.label} value={stat.value} detail={stat.detail} />
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Purpose"
          title="Vision, mission and motto"
          lede="Three statements, held to across a century."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card className="p-8">
            <p className="field">Vision</p>
            <p className="mt-4 text-lg">{SITE.vision}</p>
          </Card>
          <Card className="p-8">
            <p className="field">Mission</p>
            <p className="mt-4 text-lg">{SITE.mission}</p>
          </Card>
          <Card className="p-8">
            <p className="field">Motto</p>
            <p className="mt-4 font-serif text-2xl leading-snug">
              {SITE.motto.pali}
            </p>
            <p className="mt-3 text-sm text-quiet-ink">{SITE.motto.english}</p>
            <p className="mt-4 font-mono text-xs text-quiet-ink">
              {SITE.motto.provenance}
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <SectionHeader eyebrow="The school" title="The facts of the college" />
            <Prose className="mt-8">
              <p>
                Nalanda College is a {SITE.category.toLowerCase()} in{" "}
                {SITE.place}, {SITE.country}. It was registered as an
                independent school on {SITE.established}, a century ago, and
                teaches {SITE.gradeRange} on the national curriculum.
              </p>
              <p>
                The roll is {SITE.enrolment.total.toLocaleString()} boys across
                the junior and senior sections. Students are placed into four
                houses: {SITE.houses.map((house) => house.name).join(", ")}.
              </p>
              <p>
                The current principal is {SITE.principal}. The school is
                administered through the {SITE.address.zone} and the{" "}
                {SITE.address.division}.
              </p>
            </Prose>
          </div>

          <div>
            <Card className="p-7">
              <p className="field">Governance</p>
              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="text-quiet-ink">Principal</dt>
                  <dd className="mt-1">{SITE.principal}</dd>
                </div>
                <div>
                  <dt className="text-quiet-ink">Affiliation</dt>
                  <dd className="mt-1">{SITE.affiliation}</dd>
                </div>
                <div>
                  <dt className="text-quiet-ink">Category</dt>
                  <dd className="mt-1">{SITE.category}</dd>
                </div>
                <div>
                  <dt className="text-quiet-ink">Established</dt>
                  <dd className="mt-1">{SITE.established}</dd>
                </div>
              </dl>
            </Card>

            <Card className="mt-6 p-7">
              <p className="field">Houses</p>
              <ul className="mt-5 grid gap-2">
                {SITE.houses.map((house) => (
                  <li key={house.name} className="text-sm">
                    {house.name}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Not yet published"
          title="What this site does not yet know"
          lede="Listed rather than guessed. An empty page is more honest than a plausible sentence."
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {NEEDS_SUPPLY.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-dashed border-field px-4 py-3 text-sm text-quiet-ink"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={ROUTES.history}>Read the history</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.admissions}>Admissions</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}