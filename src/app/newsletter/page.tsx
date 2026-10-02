import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description: `The E-newspaper of ${SITE.name}, Colombo.`,
};

export default function NewsletterPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Newsletter"
        title="The Nalanda bulletin"
        lede="The college publishes a term-by-term bulletin covering events across the school. It is distributed as a shared online document."
      />

      <Section className="pt-0">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SplitText
              as="p"
              text="One document a term, assembled by the school, covering assemblies, sport, societies and the ordinary business of a college of four thousand."
              className="display-tight text-3xl md:text-4xl"
            />
          </div>
          <div className="md:col-span-6">
            <Reveal>
              <div className="rounded-[var(--radius-card)] border border-line bg-surface-raised p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                  E-newspaper
                </p>
                <h2 className="mt-3 font-display text-2xl">
                  Current issue
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  The bulletin is hosted as a shared document by the college. Past
                  issues are retained in the same document rather than as separate
                  archives.
                </p>
                <p className="mt-6 text-sm text-ink-subtle">
                  Ask the school office for access on {SITE.contact.phoneDisplay}.
                </p>
              </div>
            </Reveal>
            <Note tone="flagged" className="mt-8">
              Individual issues are not linked here. The college does not publish a
              stable public archive URL, and a link that expires would be worse than
              an honest gap.
            </Note>
          </div>
        </div>
      </Section>
    </div>
  );
}