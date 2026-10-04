import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Address, telephone, email and office hours for ${SITE.name}, ${SITE.address.locality}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Reach the college"
        lede="The office at Siri Dhamma Mawatha handles admissions, circulars and all published correspondence."
      />

      <Section className="pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-7">
            <p className="field">Telephone</p>
            <p className="mt-4 font-serif text-2xl">
              <a href={`tel:${SITE.contact.phone}`} className="wipe text-brand">
                {SITE.contact.phoneDisplay}
              </a>
            </p>
            <p className="mt-3 text-sm text-quiet-ink">
              The office line for admissions, circulars and general correspondence.
            </p>
          </Card>

          <Card className="p-7">
            <p className="field">Email</p>
            <p className="mt-4 font-serif text-2xl">
              <a href={`mailto:${SITE.contact.email}`} className="wipe break-all text-brand">
                {SITE.contact.email}
              </a>
            </p>
            <p className="mt-3 text-sm text-quiet-ink">
              Anything published by the college is also on its announcements page.
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeader eyebrow="Address" title={SITE.address.street} />
            <address className="mt-8 not-italic text-base leading-relaxed text-quiet-ink">
              {SITE.name}
              <br />
              {SITE.address.street}
              <br />
              {SITE.address.locality}
              <br />
              {SITE.address.postal}
              <br />
              {SITE.address.country}
            </address>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`tel:${SITE.contact.phone}`}>Call the office</a>
              </Button>
              <Button asChild variant="outline">
                <a href={`mailto:${SITE.contact.email}`}>Email the office</a>
              </Button>
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Location" title="Finding the college" />
            <dl className="mt-8 divide-y divide-line border-y border-line">
              <Fact label="Educational zone" value={SITE.address.zone} />
              <Fact label="Educational division" value={SITE.address.division} />
              <Fact
                label="Coordinates"
                value={
                  <span className="font-mono text-sm">
                    {SITE.coordinates.lat}, {SITE.coordinates.lng}
                  </span>
                }
              />
              <Fact
                label="Map"
                value={
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${SITE.coordinates.lat},${SITE.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="wipe text-brand"
                  >
                    Open in Google Maps
                  </a>
                }
              />
            </dl>

            <div className="mt-10">
              <Badge variant="secondary">Note</Badge>
              <p className="display-tight mt-4 text-2xl md:text-3xl">
                Admissions questions go to the office first. Everything the college
                publishes is also on its announcements page.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6">
      <dt className="field sm:col-span-4">{label}</dt>
      <dd className="text-sm sm:col-span-8">{value}</dd>
    </div>
  );
}