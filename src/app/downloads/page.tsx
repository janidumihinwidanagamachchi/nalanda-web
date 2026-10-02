import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { DOWNLOADS } from "@/data/pastPrincipals";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Downloads",
  description: `Circulars, examination papers and governance documents from ${SITE.name}, Colombo.`,
};

export default function DownloadsPage() {
  const categories = Array.from(new Set(DOWNLOADS.map((d) => d.category)));

  return (
    <div>
      <PageHeader
        eyebrow="Downloads"
        title="Papers, circulars and governance"
        lede="Everything the college publishes for parents and students in one place, grouped by what it is for."
      />

      <Section className="pt-0">
        {categories.map((category) => (
          <div key={category} className="mb-16 last:mb-0">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
              {category}
            </h2>
            <Stagger className="mt-6 divide-y divide-line border-y border-line">
              {DOWNLOADS.filter((d) => d.category === category).map((item) => (
                <StaggerItem
                  key={item.label}
                  className="grid gap-3 py-7 sm:grid-cols-12 sm:gap-8"
                >
                  <div className="sm:col-span-7">
                    <h3 className="font-display text-xl leading-snug">{item.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {item.detail}
                    </p>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="font-mono text-xs text-ink-subtle">
                      {item.format}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-ink underline underline-offset-4 transition-colors hover:text-accent"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="text-sm text-ink-subtle">On request</span>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ))}
      </Section>

      <Section className="border-t border-line bg-surface-sunken">
        <Note tone="flagged" className="max-w-3xl">
          Files are attached by the school office. Entries marked on request are
          published in Sinhala by the college and are not yet mirrored here. Ask at
          the office on {SITE.contact.phoneDisplay}.
        </Note>
      </Section>
    </div>
  );
}