import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Prose, Note, Stat } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { CountUp } from "@/components/motion/count-up";
import { SITE } from "@/data/site";
import { PRINCIPALS_NOTE } from "@/data/pastPrincipals";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.name}, Colombo. ${SITE.vision}`,
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About the College"
        title={SITE.tagline}
        lede={SITE.vision}
      />

      <Section className="border-y border-line bg-surface-raised">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeader
              eyebrow="Vision and Mission"
              title="What the college sets out to do"
            />
          </div>
          <div className="md:col-span-7">
            <div className="space-y-8">
              <Reveal>
                <blockquote className="border-l-2 border-accent pl-6">
                  <p className="font-display text-2xl leading-snug">
                    {SITE.motto.pali}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">{SITE.motto.english}</p>
                  <p className="mt-3 text-xs text-ink-subtle">
                    {SITE.motto.provenance}
                  </p>
                </blockquote>
              </Reveal>
              <Reveal delay={0.08}>
                <Prose>
                  <p>{SITE.vision}</p>
                  <p>{SITE.mission}</p>
                </Prose>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="text-sm leading-relaxed text-ink-muted">
                  The college was founded by the Buddhist educator Patrick de Silva
                  Kularatne as an offshoot of Ananda College, and registered as a
                  separate institution on 1 November 1925. Its second century falls
                  alongside the construction of an Innovation Center and Sports Arena
                  as part of the Nalanda Centenary Project.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="The college at a glance"
          lede="Figures published for the current roll, and the fixed identity of the school."
        />
        <Stagger className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 md:grid-cols-4">
          <StaggerItem>
            <Stat
              label="Established"
              value={SITE.establishedYear}
              detail={SITE.established}
            />
          </StaggerItem>
          <StaggerItem>
            <Stat
              label="Students"
              value={<CountUp value={SITE.enrolment.total} />}
              detail={`${SITE.enrolment.junior} in Grades 1 to 5`}
            />
          </StaggerItem>
          <StaggerItem>
            <Stat label="Grade range" value="1 to 13" detail="National curriculum" />
          </StaggerItem>
          <StaggerItem>
            <Stat label="Principal" value={<span className="text-3xl">{SITE.principal}</span>} detail="Office of the Principal" />
          </StaggerItem>
        </Stagger>
      </Section>

      <Section className="border-t border-line bg-surface-sunken">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader
              eyebrow="Houses"
              title="Four houses, maroon and silver"
              lede="Every Nalandian belongs to one of four houses, and the colours of the college run through the school, the Big Match and the houses themselves."
            />
          </div>
          <div className="md:col-span-8">
            <Stagger className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
              {SITE.houses.map((house, index) => (
                <StaggerItem
                  key={house.name}
                  className="group bg-surface-raised p-8"
                >
                  <div className="flex items-baseline justify-between">
                    <SplitText
                      text={house.name}
                      className="font-display text-3xl"
                      delay={index * 0.04}
                    />
                    <span className="font-mono text-xs text-ink-subtle">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">
                    House {house.order} of four
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeader
              eyebrow="Identity"
              title="Registered as a national school"
            />
          </div>
          <div className="md:col-span-7">
            <div className="grid gap-x-8 sm:grid-cols-2">
              <div className="divide-y divide-line border-t border-line">
                <Fact label="Type" value={SITE.type} />
                <Fact label="Category" value={SITE.category} />
                <Fact label="Affiliation" value={SITE.affiliation} />
                <Fact label="Location" value={`${SITE.address.street}, ${SITE.address.locality}`} />
              </div>
              <div className="divide-y divide-line border-t border-line">
                <Fact label="Zone" value={SITE.address.zone} />
                <Fact label="Division" value={SITE.address.division} />
                <Fact label="Alumni" value={SITE.alumni} />
                <Fact label="Colours" value={SITE.colours.join(" and ")} />
              </div>
            </div>
            <Note tone="flagged" className="mt-10">
              {PRINCIPALS_NOTE}
            </Note>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-subtle">{label}</p>
      <p className="mt-1.5 text-sm text-ink">{value}</p>
    </div>
  );
}