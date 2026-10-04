import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, Note, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { EXTRA_CURRICULAR_NOTES } from "@/data/extraCurricular";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Clubs",
  description: `Clubs at ${SITE.name}, Colombo: what is demonstrably running, and what the college has not published.`,
};

const KNOWN = [
  {
    name: "Debating",
    detail:
      "An English debating team was established in the 1990s under Mr. Edward Ranasinghe.",
  },
  {
    name: "Astronomy",
    detail:
      "The Astronomical Society has run more than 230 night camps, roughly 50 on the college premises.",
  },
  {
    name: "Media",
    detail:
      "The Media Unit produces some of Sri Lanka's most recognised school television and radio broadcasts.",
  },
  {
    name: "Quiz",
    detail: "The Quiz Club competes in inter-school and All Island quiz competitions.",
  },
  {
    name: "Scouting",
    detail:
      "Registered in 1967 as the 32nd Colombo Nalanda College Scouts Troop, Reg. No. A246.",
  },
  {
    name: "Commerce",
    detail:
      "The Commerce Society runs events and member activity for commerce and accountancy students.",
  },
];

export default function ClubsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Extra Curricular"
        title="Clubs"
        lede="The college maintains a clubs page, and it is currently empty. Rather than invent a club list, this page shows the activities that are demonstrably running, with a note about what is missing."
      />

      <Section className="pt-0">
        <p className="font-mono text-xs text-quiet-ink">
          {String(KNOWN.length).padStart(2, "0")} activities recorded
        </p>
        <p className="display-tight mt-4 max-w-3xl text-5xl md:text-6xl">
          A club list the college has not published is a gap we would rather show
          than paper over.
        </p>
        <p className="measure mt-6 text-lg text-quiet-ink">
          Everything below is drawn from published news, society pages and
          institutional records. None of it is a substitute for the college&apos;s
          own list, which does not yet exist.
        </p>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Recorded"
          title="Activities that are demonstrably running"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {KNOWN.map((entry, index) => (
            <Card key={entry.name} className="p-7">
              <p className="font-mono text-xs text-quiet-ink">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-serif text-xl leading-snug">{entry.name}</h2>
              <p className="mt-3 text-sm text-quiet-ink">{entry.detail}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Note tone="flagged" className="max-w-3xl">
          {EXTRA_CURRICULAR_NOTES.clubs}
        </Note>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={ROUTES.societies}>Societies</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.extraCurricular}>Extra curricular</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}