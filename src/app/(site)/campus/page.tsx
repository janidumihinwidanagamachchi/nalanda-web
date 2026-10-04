import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { MediaFrame } from "@/components/ui/card";
import { getMedia } from "@/lib/content";
import { ACADEMICS } from "@/data/academics";
import { SITE } from "@/data/site";
import { imageHandoverNote } from "@/data/media";

export const metadata: Metadata = {
  title: "Campus",
  description: `The campus of ${SITE.name} at ${SITE.address.street}: the original sixteen classrooms of 1924 and everything added since.`,
};

export default async function CampusPage() {
  const { campus } = await getMedia();

  return (
    <>
      <PageHeader
        eyebrow="Campus"
        title="Siri Dhamma Mawatha, Colombo 10"
        lede="A quarter of an acre in 1924, sixteen classrooms, and everything the college has added since."
      />

      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2">
          {campus.map((slot) => (
            <MediaFrame
              key={slot.id}
              slot={slot}
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ))}
        </div>
        <Note tone="flagged" className="mt-8 max-w-3xl">
          {imageHandoverNote}
        </Note>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Built"
              title="The original sixteen"
              lede="In 1924 the founder spent Rs. 5,500 on 0.10 hectares near the Campbell Place playground and built sixteen classrooms. Two became the principal's office and staff rooms, three became laboratories, and twelve were classrooms."
            />
            <p className="measure mt-6 text-sm text-quiet-ink">
              The college registered as a voluntary school on 1 November 1925 with
              twenty-four students. That original building is still the basis of the
              campus at {SITE.address.street}.
            </p>
          </div>

          <div>
            <h3 className="field">Facilities added since</h3>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {ACADEMICS.facilities.map((facility) => (
                <div key={facility.name} className="py-5">
                  <h4 className="font-serif text-lg">{facility.name}</h4>
                  <p className="mt-1.5 text-sm text-quiet-ink">{facility.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Address" title="Finding the college" />
            <dl className="mt-8 divide-y divide-line border-y border-line">
              <Fact label="Street" value={SITE.address.street} />
              <Fact label="Locality" value={SITE.address.locality} />
              <Fact label="Postal code" value={SITE.address.postal} />
              <Fact label="Educational zone" value={SITE.address.zone} />
              <Fact label="Division" value={SITE.address.division} />
              <Fact
                label="Coordinates"
                value={
                  <span className="font-mono text-sm">
                    {SITE.coordinates.lat}, {SITE.coordinates.lng}
                  </span>
                }
              />
            </dl>
          </div>

          <div>
            <SectionHeader
              eyebrow="Still to supply"
              title="What the school has not published"
            />
            <p className="measure mt-6 text-sm text-quiet-ink">
              Site plans, the current layout of the campus and the schedule of
              construction work on the centenary buildings are not published. The
              list below is what would be needed to complete this page.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm text-quiet-ink">
              <li>An aerial view or site plan of the campus.</li>
              <li>Photographs of the pavilion, laboratories and hostel.</li>
              <li>The current classroom block layout.</li>
            </ul>
            <Note className="mt-8">
              Contact the office on {SITE.contact.phoneDisplay} to arrange a visit.
            </Note>
          </div>
        </div>
      </Section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6">
      <p className="field sm:col-span-4">{label}</p>
      <p className="text-sm sm:col-span-8">{value}</p>
    </div>
  );
}