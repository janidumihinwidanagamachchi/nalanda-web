import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { SITE } from "@/data/site";
import { Card } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Newsletter",
  description: `The E-newspaper of ${SITE.name}, Colombo.`,
};

export default function NewsletterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Newsletter"
        title="The Nalanda bulletin"
        lede="The college publishes a term-by-term bulletin covering events across the school. It is distributed as a shared online document."
      />

      <Section className="pt-0">
        <div className="grid gap-12 md:grid-cols-2">
          <p className="display-tight text-3xl md:text-4xl">
            One document a term, assembled by the school, covering assemblies,
            sport, societies and the ordinary business of a college of four
            thousand.
          </p>

          <div>
            <Card className="p-8">
              <p className="field">E-newspaper</p>
              <h2 className="mt-3 font-serif text-2xl">Current issue</h2>
              <p className="mt-4 text-sm text-quiet-ink">
                The bulletin is hosted as a shared document by the college. Past
                issues are retained in the same document rather than as separate
                archives.
              </p>
              <p className="mt-6 text-sm text-quiet-ink">
                Ask the school office for access on {SITE.contact.phoneDisplay}.
              </p>
              <Button asChild className="mt-6">
                <a href={`tel:${SITE.contact.phone}`}>Call the office</a>
              </Button>
            </Card>

            <Note tone="flagged" className="mt-8">
              Individual issues are not linked here. The college does not publish a
              stable public archive URL, and a link that expires would be worse
              than an honest gap.
            </Note>
          </div>
        </div>
      </Section>
    </>
  );
}