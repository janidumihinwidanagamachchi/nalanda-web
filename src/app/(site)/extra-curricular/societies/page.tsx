import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, Section, SectionHeader, Note, Stat } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import {
  SOCIETIES,
  ADDITIONAL_SOCIETY_LINKS,
  EXTRA_CURRICULAR_NOTES,
} from "@/data/extraCurricular";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Societies",
  description: `The ${SOCIETIES.length} societies of ${SITE.name}, Colombo, and the society pages that circulate beyond the official list.`,
};

const GROUPS = [
  "Media and Arts",
  "Science and Technology",
  "Academic",
  "Culture and Service",
] as const;

export default function SocietiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Extra Curricular"
        title="Societies"
        lede={`${SOCIETIES.length} societies are listed by the college, working across media, science, academics and service.`}
      />

      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-4">
          {GROUPS.map((group) => (
            <Card key={group} className="p-6">
              <Stat
                label={group}
                value={String(
                  SOCIETIES.filter((s) => s.group === group).length,
                ).padStart(2, "0")}
              />
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        {GROUPS.map((group) => {
          const members = SOCIETIES.filter((s) => s.group === group);
          if (members.length === 0) return null;
          return (
            <section key={group} className="mb-16 last:mb-0">
              <SectionHeader title={group} />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((society) => (
                  <Card key={society.name} className="flex flex-col p-6">
                    <h3 className="font-serif text-lg leading-snug">
                      {society.name}
                    </h3>
                    {society.link ? (
                      <a
                        href={society.link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand"
                      >
                        {society.link.label}
                        <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <span className="mt-4 text-sm text-quiet-ink">
                        No public page
                      </span>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Also in circulation"
          title="Societies with pages but no listing"
          lede={EXTRA_CURRICULAR_NOTES.societies}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {ADDITIONAL_SOCIETY_LINKS.map((society) => (
            <Card key={society.name} className="p-7">
              <h3 className="font-serif text-xl leading-snug">{society.name}</h3>
              {society.link ? (
                <a
                  href={society.link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand"
                >
                  {society.link.label}
                  <ArrowUpRight size={14} />
                </a>
              ) : null}
            </Card>
          ))}
        </div>

        <Note tone="flagged" className="mt-10 max-w-3xl">
          These pages exist but are not in the college&apos;s official list. They are
          shown separately for exactly that reason.
        </Note>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={ROUTES.extraCurricular} className="wipe text-sm text-brand">
            Back to extra curricular
          </Link>
        </div>
      </Section>
    </>
  );
}