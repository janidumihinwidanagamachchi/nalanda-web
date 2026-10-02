import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { StickyStack } from "@/components/motion/sticky-stack";
import { CENTENARY_PROJECT, TIMELINE } from "@/data/history";
import { ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "History",
  description: `The founding and second century of ${SITE.name}, Colombo, from registration in 1925 to the Centenary Project.`,
};

const origins = TIMELINE.filter((e) => e.era === "origins");
const growth = TIMELINE.filter((e) => e.era === "growth");
const centenary = TIMELINE.filter((e) => e.era === "centenary");

export default function HistoryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="History"
        title="From a section of Ananda to a hundred years"
        lede="The college began as an offshoot of Ananda College, moved into sixteen classrooms built on a quarter-acre plot in 1924, and was registered as an independent school on 1 November 1925."
      />

      <section className="border-y border-line bg-surface-raised">
        <div className="shell flex flex-wrap items-center gap-x-10 gap-y-4 py-6 text-sm">
          <span className="text-ink-muted">
            Founder{" "}
            <span className="text-ink">Patrick de Silva Kularatne</span>
          </span>
          <span className="text-ink-muted">
            Name proposed by{" "}
            <span className="text-ink">Ananda Maitreya Thero</span>
          </span>
          <span className="text-ink-muted">
            First principal{" "}
            <span className="text-ink">Piyasena Malalasekara</span>
          </span>
          <Link
            href={ROUTES.pastPrincipals}
            className="ml-auto inline-flex items-center gap-1.5 text-ink transition-colors hover:text-accent"
          >
            Past principals
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Section className="pb-0">
        <SectionHeader
          eyebrow="1922 to 1925"
          title="How Nalanda came to be"
        />
      </Section>

      <StickyStack>
        {origins.map((entry, i) => (
          <article
            key={entry.year + entry.title}
            className="shell"
          >
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="font-mono text-sm tracking-[0.14em] text-accent">
                  {entry.year}
                </p>
                <p className="mt-2 font-mono text-xs text-ink-subtle">
                  {String(i + 1).padStart(2, "0")} / {String(origins.length).padStart(2, "0")}
                </p>
              </div>
              <div className="md:col-span-8">
                <SplitText
                  text={entry.title}
                  className="display-tight text-4xl md:text-5xl"
                  delay={0.05}
                />
                <Reveal delay={0.2} className="mt-6">
                  <p className="measure text-lg leading-relaxed text-ink-muted">
                    {entry.body}
                  </p>
                </Reveal>
              </div>
            </div>
          </article>
        ))}
      </StickyStack>

      <Section className="border-t border-line">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <SectionHeader eyebrow="1926" title="The first decade" />
          </div>
          <div className="md:col-span-9">
            {growth.map((entry) => (
              <Reveal key={entry.title}>
                <h3 className="font-display text-2xl">{entry.title}</h3>
                <p className="measure mt-4 text-base leading-relaxed text-ink-muted">
                  {entry.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-y border-line bg-surface-sunken">
        <SectionHeader
          eyebrow="The second century"
          title="2025 and after"
          lede="A hundred years of scholarship, discipline and service, and the works now underway to carry the college into its second century."
        />
        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
          {centenary.map((entry) => (
            <StaggerItem key={entry.title} className="bg-surface-raised p-8">
              <p className="font-mono text-xs tracking-[0.14em] text-accent">
                {entry.year}
              </p>
              <h3 className="mt-3 font-display text-xl leading-snug">{entry.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {entry.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeader
              eyebrow="Centenary Project"
              title={CENTENARY_PROJECT.name}
              lede={CENTENARY_PROJECT.summary}
            />
            <Reveal className="mt-8">
              <a
                href={CENTENARY_PROJECT.site}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-accent"
              >
                Visit the project website
                <ArrowRight size={16} />
              </a>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <div className="space-y-8">
              {CENTENARY_PROJECT.facilities.map((facility) => (
                <Reveal key={facility.name}>
                  <h3 className="font-display text-2xl">{facility.name}</h3>
                  <p className="measure mt-3 text-base leading-relaxed text-ink-muted">
                    {facility.detail}
                  </p>
                </Reveal>
              ))}
            </div>

            <div className="mt-12 border-t border-line">
              {CENTENARY_PROJECT.milestones.map((milestone) => (
                <div
                  key={milestone.date}
                  className="grid gap-2 border-b border-line py-5 sm:grid-cols-12 sm:gap-6"
                >
                  <p className="font-mono text-xs tracking-[0.12em] text-accent sm:col-span-4">
                    {milestone.date}
                  </p>
                  <div className="sm:col-span-8">
                    <p className="font-medium">{milestone.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {milestone.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Note className="mt-10">
              The Centenary Project accepts donations through its own platform, or
              by email at{" "}
              <span className="font-mono text-ink">{CENTENARY_PROJECT.email}</span>.
            </Note>
          </div>
        </div>
      </Section>
    </div>
  );
}