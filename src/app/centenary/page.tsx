import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader } from "@/components/ui/section";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { CENTENARY_PROJECT } from "@/data/history";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Centenary",
  description: `The Nalanda Centenary Project: an Innovation Center and Sports Arena for the second century.`,
};

export default function CentenaryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Centenary"
        title="A hundred years, and the works for the next hundred"
        lede={CENTENARY_PROJECT.summary}
      >
        <div className="flex flex-wrap gap-3">
          <MagneticButton href={CENTENARY_PROJECT.site} external variant="solid">
            Project website
          </MagneticButton>
          <MagneticButton href={ROUTES.history} variant="outline">
            The full history
          </MagneticButton>
        </div>
      </PageHeader>

      <Section className="pt-0">
        <Stagger className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
          {CENTENARY_PROJECT.facilities.map((facility) => (
            <StaggerItem key={facility.name} className="bg-surface-raised p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                Project
              </p>
              <h2 className="mt-3 font-display text-3xl">{facility.name}</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {facility.detail}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="border-y border-line bg-surface-sunken">
        <SectionHeader
          eyebrow="Milestones"
          title="How the project began"
          lede="From the foundation stone to a signed partnership with STEMUP."
        />
        <Stagger className="mt-14 divide-y divide-line border-y border-line">
          {CENTENARY_PROJECT.milestones.map((milestone) => (
            <StaggerItem
              key={milestone.date}
              className="grid gap-4 py-8 sm:grid-cols-12 sm:gap-8"
            >
              <p className="font-mono text-xs tracking-[0.12em] text-accent sm:col-span-4">
                {milestone.date}
              </p>
              <div className="sm:col-span-8">
                <h3 className="font-display text-xl">{milestone.label}</h3>
                <p className="measure mt-2 text-sm leading-relaxed text-ink-muted">
                  {milestone.detail}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SplitText
              as="p"
              text="Donations are accepted through the project platform, or by email to the project office."
              className="display-tight text-3xl md:text-4xl"
            />
          </div>
          <div className="md:col-span-6">
            <Reveal>
              <div className="rounded-[var(--radius-card)] border border-line bg-surface-raised p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                  Give
                </p>
                <p className="mt-4 font-mono text-lg text-accent">
                  {CENTENARY_PROJECT.email}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                  The project also offers brochures, building plans, a bill of
                  quantities and a schedule, and arranges tours of the works. Contact
                  the college office on {SITE.contact.phoneDisplay} to book one.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </div>
  );
}