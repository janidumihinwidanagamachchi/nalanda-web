import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/constants/site";
import { getMedia } from "@/lib/content";
import { SectionHeader } from "@/components/ui/section";
import { MediaFrame } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * A short band of real photographs for the home page.
 *
 * Every image here is licensed rather than owned by the school, so the credit
 * sits under the frame in full rather than being deferred to the gallery. That
 * is deliberate: an attribution a reader has to go looking for is not really an
 * attribution.
 */
export async function Photographs() {
  const { home } = await getMedia();

  return (
    <section className="shell py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          eyebrow="Photographs"
          title="The college, as it stands"
          lede="Photographs of the campus and its activities, credited to the people who took them."
        />
        <Button asChild variant="outline" className="mb-2">
          <Link href={ROUTES.gallery}>
            All photographs
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {home.map((slot) => (
          <div key={slot.id}>
            <MediaFrame
              slot={slot}
              className="aspect-[4/3]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="mt-3">
              <p className="text-sm">{slot.alt}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-quiet-ink">
                {slot.credit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}