import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

import {
  ADDITIONAL_SOCIETY_LINKS,
  EXTRA_CURRICULAR_NOTES,
  SOCIETIES,
  type Society,
} from "@/data/extraCurricular";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Societies",
  description: `The societies of ${SITE.name}, Colombo.`,
};

export default function SocietiesPage() {
  const groups = Array.from(new Set(SOCIETIES.map((s) => s.group)));

  return (
    <div>
      <PageHeader
        eyebrow="Extra Curricular"
        title="Societies"
        lede={`${SOCIETIES.length} societies are listed by the college, working across media, science, academics and service.`}
      />

      {groups.map((group) => (
        <Section key={group}>
          <SectionHeader title={group} />
          <Stagger className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {SOCIETIES.filter((s) => s.group === group).map((society) => (
              <SocietyCard key={society.name} society={society} />
            ))}
          </Stagger>
        </Section>
      ))}

      <Section className="border-t border-line bg-surface-sunken">
        <SectionHeader
          eyebrow="Also in circulation"
          title="Societies with pages but no listing"
          lede={EXTRA_CURRICULAR_NOTES.societies}
        />
        <Stagger className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
          {ADDITIONAL_SOCIETY_LINKS.map((society) => (
            <SocietyCard key={society.name} society={society} />
          ))}
        </Stagger>
      </Section>
    </div>
  );
}

function SocietyCard({ society }: { society: Society }) {
  return (
    <StaggerItem className="bg-surface-raised p-7">
      <h3 className="font-display text-xl leading-snug">{society.name}</h3>
      {society.link ? (
        <a
          href={society.link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent"
        >
          {society.link.label}
          <span aria-hidden>→</span>
        </a>
      ) : (
        <span className="mt-4 inline-flex text-sm text-ink-subtle">
          No published link
        </span>
      )}
    </StaggerItem>
  );
}