import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { getMedia } from "@/lib/content";
import { SITE } from "@/data/site";
import { imageHandoverNote } from "@/data/media";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photographs of ${SITE.name}, Colombo: classrooms, halls, courts and nights under stars.`,
};

export default async function GalleryPage() {
  const { gallery } = await getMedia();

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="A hundred years of the college"
        lede="A centenary of classrooms, halls, courts and nights under stars. Frames labelled Photograph are real and credited in full; the rest stand in until the school's archive is supplied."
      />

      <Section className="pt-0">
        <GalleryGrid slots={gallery} />
      </Section>

      <Section>
        <Note tone="flagged" className="max-w-3xl">
          {imageHandoverNote}
        </Note>
      </Section>
    </>
  );
}