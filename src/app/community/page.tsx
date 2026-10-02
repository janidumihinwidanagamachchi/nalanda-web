import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { COMMUNITY_BODIES, INTERNATIONAL_BRANCHES } from "@/data/community";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community",
  description: `Alumni associations, the media unit, the Big Match and the societies of ${SITE.name}, Colombo.`,
};

export default function CommunityPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Community"
        title="The bodies around the college"
        lede="Eight associations, societies and clubs that carry Nalanda beyond the campus, each with its own website or page."
      />

      <Section className="pt-0">
        <Stagger className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
          {COMMUNITY_BODIES.map((body) => (
            <StaggerItem key={body.slug} className="bg-surface-raised p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                {body.kind}
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug">
                {body.name}
              </h2>
              <p className="mt-3 text-sm text-ink-subtle">{body.founded}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {body.summary}
              </p>

              {body.links?.length ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {body.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-line px-3 py-1.5 text-xs text-ink transition-colors hover:border-accent hover:text-accent"
                      >
                        {link.label}
                        {link.verified ? (
                          <span
                            className="size-1.5 rounded-full bg-emerald-600"
                            title="Link checked and live"
                            aria-label="Checked and live"
                          />
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="border-y border-line bg-surface-sunken">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader
              eyebrow="Overseas"
              title="International branches"
              lede="Old Nalandians' Associations and alumni groups outside Sri Lanka."
            />
          </div>
          <div className="md:col-span-8">
            <Stagger className="divide-y divide-line border-t border-line">
              {INTERNATIONAL_BRANCHES.map((branch) => (
                <StaggerItem
                  key={branch.region}
                  className="flex flex-wrap items-baseline justify-between gap-4 bg-transparent py-5"
                >
                  <span className="font-display text-xl">{branch.region}</span>
                  <span className="flex flex-wrap gap-2">
                    {branch.links?.map((link) => (
                      <a
                        key={link.href + link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-ink-muted underline underline-offset-4 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </a>
                    ))}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SplitText
              as="p"
              text="Every branch carries the same name and the same colours."
              className="display-tight text-3xl md:text-4xl"
            />
          </div>
          <div className="md:col-span-6">
            <Reveal>
              <p className="measure text-base leading-relaxed text-ink-muted">
                The OBA Melbourne was a Tagline Partner of the Nalanda Centennial
                Rugby Fiesta, and the Old Nalandians&rsquo; Sports Club has organised the
                boxing and rugby fixtures of the centenary programme since 1967.
              </p>
            </Reveal>
            <Note tone="flagged" className="mt-8">
              Several links on this page are shown with a green dot where they were
              checked directly and are live. Facebook and Instagram pages cannot be
              machine-checked and are shown without one.{" "}
              <Link
                href={ROUTES.channels}
                className="text-accent underline underline-offset-4"
              >
                See the full directory
              </Link>
              .
            </Note>
            <p className="mt-6 text-sm text-ink-subtle">
              Enquiries: {SITE.contact.phoneDisplay}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}