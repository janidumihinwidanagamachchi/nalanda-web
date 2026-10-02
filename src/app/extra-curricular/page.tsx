import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { LinkCard } from "@/components/ui/card";
import { ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";
import {
  EXTRA_CURRICULAR_NOTES,
  SOCIETIES,
  SPORTS,
} from "@/data/extraCurricular";

export const metadata: Metadata = {
  title: "Extra Curricular",
  description: `Clubs, societies and sport at ${SITE.name}, Colombo.`,
};

export default function ExtraCurricularPage() {
  const societyCount = SOCIETIES.length;
  const sportCount = SPORTS.length;

  return (
    <div>
      <PageHeader
        eyebrow="Extra Curricular"
        title="What happens outside the classroom"
        lede="Seventeen societies, a sporting tradition running from the cadet band to the centenary rugby fiesta, and clubs the college has yet to publish."
      />

      <Section className="pt-0">
        <div className="grid gap-8 md:grid-cols-3">
          <LinkCard
            href={ROUTES.clubs}
            title="Clubs"
            meta="To be published"
            body={EXTRA_CURRICULAR_NOTES.clubs}
          />
          <LinkCard
            href={ROUTES.societies}
            title="Societies"
            meta={`${societyCount} societies`}
            body="Media, science, academic and cultural societies, each with its own page and programme."
          />
          <LinkCard
            href={ROUTES.sports}
            title="Sports"
            meta={`${sportCount} sports`}
            body="From the Western Cadet Band to boxing, aquatics, rugby, athletics, badminton and squash."
          />
        </div>
      </Section>

      <Section className="border-y border-line bg-surface-raised">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeader
              eyebrow="Societies in brief"
              title="Four groups"
              lede="The college's societies, sorted into the broad areas they work in."
            />
          </div>
          <div className="md:col-span-7">
            <div className="divide-y divide-line border-t border-line">
              {groupCounts().map((group) => (
                <Reveal key={group.label} distance={16}>
                  <div className="flex items-baseline justify-between py-5">
                    <span className="text-base">{group.label}</span>
                    <span className="font-mono text-lg tabular-nums text-ink-muted">
                      {String(group.count).padStart(2, "0")}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SplitText
          as="p"
          text="A century in, the cadet band reclaimed a national title after twenty-five years, and the Astronomical Society has run more than two hundred night camps."
          className="display-tight max-w-4xl text-3xl md:text-4xl"
        />
      </Section>
    </div>
  );
}

function groupCounts() {
  const map = new Map<string, number>();
  for (const society of SOCIETIES) {
    map.set(society.group, (map.get(society.group) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
}