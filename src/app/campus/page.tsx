import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { MediaFrame } from "@/components/ui/card";
import { CAMPUS_SLOTS } from "@/data/media";
import { ACADEMICS } from "@/data/academics";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Campus",
  description: `The campus of ${SITE.name}, Colombo, at Siri Dhamma Mawatha.`,
};

export default function CampusPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Campus"
        title="Siri Dhamma Mawatha, Colombo 10"
        lede="A quarter of an acre in 1924, sixteen classrooms, and everything the college has added since."
      />

      <Section className="pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {CAMPUS_SLOTS.map((slot, index) => (
            <Reveal key={slot.id} delay={index * 0.06}>
              <MediaFrame
                slot={slot}
                className="aspect-[7/5]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-y border-line bg-surface-raised">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeader
              eyebrow="Built"
              title="The original sixteen"
              lede="In 1924 the founder spent Rs. 5,500 on 0.10 hectares near the Campbell Place playground and built sixteen classrooms. Two became the principal&rsquo;s office and staff rooms, three became laboratories, and twelve were classrooms."
            />
          </div>
          <div className="md:col-span-8">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
              What stands there now
            </h3>
            <Stagger className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {ACADEMICS.facilities.map((facility) => (
                <StaggerItem key={facility.name}>
                  <h4 className="font-display text-lg">{facility.name}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {facility.note}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-display text-3xl">Finding the college</h2>
          </div>
          <div className="md:col-span-7">
            <div className="divide-y divide-line border-y border-line">
              <Fact label="Address" value={SITE.address.full} />
              <Fact label="Telephone" value={SITE.contact.phoneDisplay} />
              <Fact
                label="Coordinates"
                value={`${SITE.coordinates.lat}, ${SITE.coordinates.lng}`}
              />
              <Fact label="Educational zone" value={SITE.address.zone} />
              <Fact label="Educational division" value={SITE.address.division} />
            </div>
            <Note tone="flagged" className="mt-10">
              A published map embed is not included. The college&rsquo;s location is
              sensitive in a school setting, so the map is left to the school to add
              once it has decided what to show publicly.
            </Note>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-subtle sm:col-span-4">
        {label}
      </p>
      <p className="text-sm sm:col-span-8">{value}</p>
    </div>
  );
}