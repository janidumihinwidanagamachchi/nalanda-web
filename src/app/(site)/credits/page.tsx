import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/site";
import { getMedia } from "@/lib/content";
import type { MediaSlot, PhotoSource } from "@/data/media";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Credits",
  description: `Photographic credits and licences for ${SITE.name}, Colombo.`,
};

/**
 * Narrows a slot to one that actually carries provenance. Declared as a type
 * predicate rather than reached for with `!` at each use site, so the compiler
 * can prove `source` is present everywhere it is read.
 */
function credited(slot: MediaSlot): slot is MediaSlot & { source: PhotoSource } {
  return slot.source !== undefined;
}

export default async function CreditsPage() {
  const { all, awaiting } = await getMedia();

  /**
   * One entry per photograph, not per slot. The Malalasekara auditorium is both
   * the hero and a gallery frame, and crediting the same file twice would read as
   * a mistake rather than as two placements of one picture.
   */
  const published = all.filter(credited).filter(
    (slot, index, entries) =>
      entries.findIndex((other) => other.source.page === slot.source.page) ===
      index,
  );

  return (
    <>
      <PageHeader
        eyebrow="Credits"
        title="Photographs and licences"
        lede="Every photograph here belongs to the person who took it. Each one is credited to its author and to the licence it was published under."
      />

      <Section>
        <div className="grid gap-16">
          <section>
            <h2 className="field">Published photographs</h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {published.map((slot) => (
                <div
                  key={slot.id}
                  className="grid gap-3 py-7 sm:grid-cols-12 sm:gap-8"
                >
                  <div className="sm:col-span-7">
                    <h3 className="font-serif text-xl leading-snug">{slot.alt}</h3>
                    <p className="measure mt-2 text-sm text-quiet-ink">
                      Photograph by {slot.source.author}.
                    </p>
                  </div>
                  <div className="sm:col-span-5 sm:text-right">
                    <a
                      href={slot.source.licenseUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="wipe text-sm text-brand"
                    >
                      {slot.source.license}
                    </a>
                    <p className="field mt-3">
                      <a
                        href={slot.source.page}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="wipe text-brand"
                      >
                        Original file
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="field">Still awaiting a photograph</h2>
            <p className="measure mt-4 text-base text-quiet-ink">
              These frames are placeholders. They are not photographs of the
              college and are not presented as such; each stands in until the
              college archive supplies the real thing.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {awaiting.map((slot) => (
                <li key={slot.id} className="text-sm text-quiet-ink">
                  {slot.alt.replace(/^Placeholder: /, "")}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="field">How these images are used</h2>
            <div className="prose-body measure mt-4 max-w-3xl text-base">
              <p>
                Every photograph listed above is reproduced without alteration
                and remains under the licence named beside it. Nothing here
                changes the terms its author chose.
              </p>
              <p>
                Items marked <span className="font-medium">CC BY-SA</span>{" "}
                require that derivatives keep the same licence, and{" "}
                <span className="font-medium">CC BY</span> requires
                attribution. Both are satisfied by this page and by the credit
                shown beneath each image. Photographs that belong to the school
                or to its Old Boys do not carry a third-party licence and are
                used with permission from the college.
              </p>
            </div>
          </section>
        </div>
      </Section>

      <Section className="pt-0">
        <Note tone="flagged" className="max-w-3xl">
          Something wrong with a credit, or you hold a photograph of the college
          you would rather see here? Write to{" "}
          <a href={`mailto:${SITE.contact.email}`} className="wipe text-brand">
            {SITE.contact.email}
          </a>
          .
        </Note>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={ROUTES.gallery}>Back to the gallery</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.channels}>Official channels</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}