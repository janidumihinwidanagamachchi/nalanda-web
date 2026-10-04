import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { DOWNLOADS } from "@/data/pastPrincipals";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Downloads",
  description: `Papers, circulars and governance documents published by ${SITE.name}, Colombo.`,
};

const CATEGORY_ORDER = [
  "Examinations",
  "Circulars",
  "Governance",
  "Centenary",
] as const;

export default function DownloadsPage() {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: DOWNLOADS.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Downloads"
        title="Papers, circulars and governance"
        lede="Everything the college publishes for parents and students in one place, grouped by what it is for."
      />

      <Section>
        <div className="grid gap-16">
          {grouped.map((group) => (
            <section key={group.category}>
              <h2 className="field">{group.category}</h2>
              <div className="mt-6 divide-y divide-line border-y border-line">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-3 py-7 sm:grid-cols-12 sm:gap-8"
                  >
                    <div className="sm:col-span-7">
                      <h3 className="font-serif text-xl leading-snug">
                        {item.label}
                      </h3>
                      <p className="measure mt-2 text-sm text-quiet-ink">
                        {item.detail}
                      </p>
                    </div>
                    <div className="sm:col-span-5 sm:text-right">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="wipe text-sm text-brand"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-sm text-quiet-ink">On request</span>
                      )}
                      <p className="field mt-3">{item.format}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>

      <Section>
        <Note className="max-w-3xl">
          Documents that are not linked here are held by the school office and are
          provided on request. Request them on {SITE.contact.phoneDisplay} or at{" "}
          <a href={`mailto:${SITE.contact.email}`} className="wipe text-brand">
            {SITE.contact.email}
          </a>
          .
        </Note>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={ROUTES.announcements}>Current announcements</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.calendar}>Confirmed dates</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}