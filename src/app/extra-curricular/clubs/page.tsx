import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { HorizontalPan } from "@/components/motion/sticky-stack";
import { EXTRA_CURRICULAR_NOTES } from "@/data/extraCurricular";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Clubs",
  description: `Clubs at ${SITE.name}, Colombo.`,
};

const CLUB_ACTIVITIES = [
  { name: "Debating", detail: "An English debating team was established in the 1990s under Mr. Edward Ranasinghe." },
  { name: "Astronomy", detail: "The Astronomical Society has run more than 230 night camps, roughly 50 on the college premises." },
  { name: "Media", detail: "The Media Unit produces some of Sri Lanka's most recognised school television and radio broadcasts." },
  { name: "Quiz", detail: "The Quiz Club competes in inter-school and All Island quiz competitions." },
  { name: "Scouting", detail: "Registered in 1967 as the 32nd Colombo Nalanda College Scouts Troop, Reg. No. A246." },
  { name: "Commerce", detail: "The Commerce Society runs events and member activity for commerce and accountancy students." },
];

export default function ClubsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Extra Curricular"
        title="Clubs"
        lede="The college maintains a clubs page, and it is currently empty. Rather than invent a club list, this page shows the activities that are demonstrably running, with a note about what is missing."
      />

      <Section className="pt-0">
        <HorizontalPan>
          {CLUB_ACTIVITIES.map((activity, index) => (
            <div
              key={activity.name}
              className="flex h-[100dvh] w-[82vw] shrink-0 items-center border-r border-line px-8 md:w-[46vw]"
            >
              <div>
                <p className="font-mono text-xs text-ink-subtle">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(CLUB_ACTIVITIES.length).padStart(2, "0")}
                </p>
                <SplitText
                  text={activity.name}
                  className="display-tight mt-4 text-5xl md:text-6xl"
                />
                <p className="measure mt-6 text-lg leading-relaxed text-ink-muted">
                  {activity.detail}
                </p>
              </div>
            </div>
          ))}
        </HorizontalPan>
      </Section>

      <Section className="border-t border-line">
        <Reveal>
          <SplitText
            as="p"
            text="Scroll sideways. A club list the college has not published is a gap we would rather show than paper over."
            className="display-tight max-w-3xl text-3xl md:text-4xl"
          />
        </Reveal>
        <Note tone="flagged" className="mt-12 max-w-3xl">
          {EXTRA_CURRICULAR_NOTES.clubs}
        </Note>
      </Section>
    </div>
  );
}