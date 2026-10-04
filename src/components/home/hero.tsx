import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";
import { getMedia } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * The masthead.
 *
 * The image sits behind the type on wide screens and below it on narrow ones,
 * rather than in a two-column split, so the photograph reads as a single plate
 * and stays legible under the scrim at any width.
 *
 * The plate is currently the Malalasekara auditorium rather than the main
 * building, which the school has not yet supplied. The credit beneath the type
 * names the photographer, and the caption is not allowed to imply the building
 * is the one the school would most want shown.
 */
export async function Hero() {
  const { hero } = await getMedia();

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0">
        <Image
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          priority
          sizes="100vw"
          className="size-full object-cover"
        />
        {/* The scrim is the only thing standing between the photograph and the
            type, so it ramps hard at the bottom where the text sits. */}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/85 to-canvas/40" />
      </div>

      <div className="shell relative py-24 md:py-32 lg:py-40">
        <Badge variant="secondary">
          {SITE.category} &middot; {SITE.affiliation}
        </Badge>

        <h1 className="display-tight mt-6 max-w-4xl text-5xl md:text-6xl lg:text-7xl">
          Wisdom Illuminates Character
        </h1>

        <p className="measure mt-6 text-lg text-quiet-ink">
          {SITE.name}, {SITE.place} &mdash; founded {SITE.established}, teaching{" "}
          {SITE.gradeRange} to {SITE.enrolment.total.toLocaleString()} boys on{" "}
          {SITE.address.street}.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={ROUTES.admissions}>
              Admissions
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={ROUTES.announcements}>Announcements</Link>
          </Button>
        </div>

        <p className="mt-12 font-mono text-xs text-quiet-ink">
          {hero.credit}
        </p>
      </div>
    </section>
  );
}