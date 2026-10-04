import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/data/site";
import { COMMUNITY_BODIES, INTERNATIONAL_BRANCHES } from "@/data/community";
import { ROUTES } from "@/constants/site";
import { PageHeader, Section, SectionHeader, Prose, Stat } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Alumni",
  description: `${SITE.alumni}: the Old Nalandians' Association, its junior counterpart, and the branches overseas.`,
};

export default function AlumniPage() {
  const oba = COMMUNITY_BODIES.find((body) => body.slug === "oba");
  const njoba = COMMUNITY_BODIES.find((body) => body.slug === "njoba");
  const sportsClub = COMMUNITY_BODIES.find((body) => body.slug === "onsc");
  const astronomy = COMMUNITY_BODIES.find(
    (body) => body.slug === "astronomical-society",
  );

  return (
    <>
      <PageHeader
        eyebrow="Alumni"
        title="Old Nalandians"
        lede="Past pupils are organised into a national association, a junior association, a sports club, an astronomical society, and branches overseas."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <Stat label="Bodies" value={COMMUNITY_BODIES.length} detail="Organisations listed" />
          </Card>
          <Card className="p-6">
            <Stat label="Overseas" value={INTERNATIONAL_BRANCHES.length} detail="Regional branches" />
          </Card>
          <Card className="p-6">
            <Stat label="Sports club" value="1967" detail="Founded" />
          </Card>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="The association"
              title="Nalanda College Old Boys' Association"
            />
            <Prose className="mt-8">
              <p>
                The OBA is the national body of Old Nalandians, maintaining the
                connection between past pupils and the college and organising
                major fixtures and occasions.
              </p>
              <p>
                Its junior counterpart, the Nalanda Junior Old Boys&apos;
                Association, organises events including Ranaviru Upahara and
                represents younger Old Nalandians.
              </p>
            </Prose>
          </div>

          <Card className="p-7">
            <p className="field">Get in touch</p>
            <div className="mt-5 grid gap-3 text-sm">
              {oba?.links?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="wipe text-brand"
                >
                  {link.label}
                </a>
              ))}
              {njoba?.links?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="wipe text-brand"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Alumni bodies"
          title="Clubs and societies run by Old Nalandians"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[sportsClub, astronomy].map((body) =>
            body ? (
              <Card key={body.slug} className="p-7">
                <p className="field">{body.kind}</p>
                <h3 className="mt-4 font-serif text-xl leading-snug">{body.name}</h3>
                <p className="mt-3 text-sm text-quiet-ink">{body.summary}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {body.links?.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null,
          )}
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={ROUTES.community}>Every community body</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.contact}>Contact the college</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}