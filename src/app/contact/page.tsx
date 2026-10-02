import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact details and location for ${SITE.name}, Colombo.`,
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Reach the college"
        lede="The office at Siri Dhamma Mawatha handles admissions, circulars and all published correspondence."
      >
        <MagneticButton href={`tel:${SITE.contact.phone}`} variant="solid">
          Call {SITE.contact.phoneDisplay}
        </MagneticButton>
      </PageHeader>

      <Section className="pt-0">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeader eyebrow="Address" title={SITE.address.street} />
            <Reveal className="mt-8">
              <address className="not-italic text-base leading-relaxed text-ink-muted">
                {SITE.address.full}
              </address>
            </Reveal>
            <Reveal delay={0.08}>
              <dl className="mt-10 divide-y divide-line border-y border-line">
                <Row label="Telephone" value={SITE.contact.phoneDisplay} />
                <Row label="Email" value={SITE.contact.email} />
                <Row label="Coordinates" value={`${SITE.coordinates.lat}, ${SITE.coordinates.lng}`} />
                <Row label="Zone" value={SITE.address.zone} />
                <Row label="Division" value={SITE.address.division} />
              </dl>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <SplitText
              as="p"
              text="Admissions questions go to the office first. Everything the college publishes is also on its announcements page."
              className="display-tight text-3xl md:text-4xl"
            />
            <Reveal delay={0.12}>
              <div className="mt-10 flex flex-wrap gap-3">
                <MagneticButton href="/announcements" variant="outline">
                  Announcements
                </MagneticButton>
                <MagneticButton href="/admissions" variant="ghost">
                  Admissions
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6">
      <dt className="text-xs uppercase tracking-[0.14em] text-ink-subtle sm:col-span-4">
        {label}
      </dt>
      <dd className="text-sm sm:col-span-8">{value}</dd>
    </div>
  );
}