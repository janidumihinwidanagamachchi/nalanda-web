import type { Metadata } from "next";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { SITE } from "@/data/site";
import { imageHandoverNote } from "@/data/media";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photographs of ${SITE.name}, Colombo.`,
};

export default function GalleryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gallery"
        title="A hundred years of the college"
        lede="A centenary of classrooms, halls, courts and nights under stars. Every frame here is a placeholder until the school's archive is supplied."
      />
      <Section className="pt-0">
        <GalleryGrid />
      </Section>
      <Section className="border-t border-line bg-surface-sunken">
        <Note tone="flagged" className="max-w-3xl">
          {imageHandoverNote}
        </Note>
      </Section>
    </div>
  );
}