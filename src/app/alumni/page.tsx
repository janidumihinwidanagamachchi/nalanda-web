import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { COMMUNITY_BODIES } from "@/data/community";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Alumni",
  description: `Old Nalandians and the associations of ${SITE.name}, Colombo.`,
};

const ALUMNI_BODIES = COMMUNITY_BODIES.filter((b) =>
  ["oba", "njoba", "onsc", "astronomical-society", "commerce-society"].includes(b.slug),
);

export default function AlumniPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Alumni"
        title="Old Nalandians"
        lede="Graduates are known as Old Nalandians, and the associations below are the structures they built for one another."
      />

      <Section className="pt-0">
        <Stagger className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
          {ALUMNI_BODIES.map((body) => (
            <StaggerItem key={body.slug} className="bg-surface-raised p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                {body.kind}
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug">{body.name}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {body.summary}
              </p>
              {body.website ? (
                <a
                  href={body.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent"
                >
                  Visit website
                  <span aria-hidden>→</span>
                </a>
              ) : null}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="border-y border-line bg-surface-sunken">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SplitText
              as="p"
              text="Nalanda has produced members of parliament, judges, academics and a cricket captain who was once the most sought after in the world."
              className="display-tight text-3xl md:text-4xl"
            />
          </div>
          <div className="md:col-span-6">
            <Reveal>
              <Note tone="flagged">
                A list of distinguished Old Nalandians is not published by the
                college and has not been compiled here. Inventing a roll of honour
                for a living institution would be worse than leaving it empty.
              </Note>
            </Reveal>
            <p className="mt-8 text-sm leading-relaxed text-ink-muted">
              For the full directory of community bodies and official pages, see{" "}
              <Link
                href={ROUTES.channels}
                className="text-accent underline underline-offset-4"
              >
                Channels
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Records held by the college" />
        <Stagger className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          <StaggerItem>
            <h3 className="font-display text-xl">Hermann Loos Challenge Trophy</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Joint championship won in 2016, after 34 years.
            </p>
          </StaggerItem>
          <StaggerItem>
            <h3 className="font-display text-xl">Island first places</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Advanced Level science and commerce streams, and Ordinary Level,
              under Mr. H. U. Premathilka.
            </p>
          </StaggerItem>
        </Stagger>
      </Section>
    </div>
  );
}