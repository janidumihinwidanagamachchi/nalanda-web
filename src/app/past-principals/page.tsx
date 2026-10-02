import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Note, Stat } from "@/components/ui/section";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { PAST_PRINCIPALS, PRINCIPALS_NOTE } from "@/data/pastPrincipals";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Past Principals",
  description: `Principals of ${SITE.name}, Colombo, from 1969 to the present.`,
};

export default function PastPrincipalsPage() {
  const years = PAST_PRINCIPALS.reduce(
    (total, p) => total + (p.to - p.from),
    0,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Past Principals"
        title="The principals who shaped Nalanda"
        lede="Six principals are recorded by the college, from 1969 onward. Each is remembered for what was built, taught or won."
      />

      <Section className="pt-0">
        <Stagger className="grid grid-cols-2 gap-x-8 border-t border-line pt-10 md:grid-cols-3">
          <StaggerItem>
            <Stat label="Recorded" value={PAST_PRINCIPALS.length} detail="Principals published" />
          </StaggerItem>
          <StaggerItem>
            <Stat label="Span" value={`${years} years`} detail="1969 to 2017" />
          </StaggerItem>
          <StaggerItem>
            <Stat
              label="Current"
              value={<span className="text-2xl">{SITE.principal}</span>}
              detail="Principal"
            />
          </StaggerItem>
        </Stagger>
      </Section>

      <Section className="pt-0">
        <div className="divide-y divide-line border-t border-line">
          {PAST_PRINCIPALS.map((principal) => (
            <Reveal key={principal.name}>
              <article className="grid gap-8 py-14 md:grid-cols-12">
                <div className="md:col-span-3">
                  <p className="font-mono text-sm tracking-[0.12em] text-accent">
                    {principal.tenure}
                  </p>
                </div>
                <div className="md:col-span-9">
                  <h2 className="font-display text-3xl leading-tight md:text-4xl">
                    {principal.name}
                  </h2>
                  <p className="measure mt-5 text-base leading-relaxed text-ink-muted">
                    {principal.summary}
                  </p>

                  <div className="mt-9 grid gap-10 md:grid-cols-2">
                    <div>
                      <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                        Achievements
                      </h3>
                      <ul className="mt-4 space-y-2.5">
                        {principal.achievements.map((item) => (
                          <li
                            key={item}
                            className="border-l border-line pl-4 text-sm leading-relaxed text-ink-muted"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                        Left behind
                      </h3>
                      <ul className="mt-4 space-y-2.5">
                        {principal.legacy.map((item) => (
                          <li
                            key={item}
                            className="border-l border-line pl-4 text-sm leading-relaxed text-ink-muted"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line bg-surface-sunken">
        <SectionHeader title="Before 1969" />
        <Note tone="flagged" className="mt-6 max-w-2xl">
          {PRINCIPALS_NOTE}
        </Note>
      </Section>
    </div>
  );
}