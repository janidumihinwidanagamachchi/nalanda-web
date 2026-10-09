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
 * The layout the preview uses: type on the left, a photograph panel on the right,
 * rather than a photograph behind the type. The difference matters for
 * legibility. A full-bleed photograph under a headline needs a scrim strong
 * enough to hide the image, and once the scrim is strong enough the photograph
 * has been darkened for the reader's benefit only. Side by side, the type sits on
 * the flat `--deep` field at full contrast and the photograph is simply a
 * photograph.
 *
 * The plate panel carries the credit line rather than the copy, for the same
 * reason it does elsewhere on the site: an attribution a reader has to go looking
 * for is not an attribution.
 */
export async function Hero() {
  const { hero } = await getMedia();

  return (
    <section className="grid border-b border-line lg:grid-cols-[minmax(0,44%)_minmax(0,56%)]">
      <div className="flex flex-col justify-center bg-deep px-[var(--page-gutter)] py-14 text-deep-ink md:py-20">
        <Badge variant="secondary" className="self-start bg-deep-ink/15 text-deep-ink">
          {SITE.category} &middot; EST. {SITE.establishedYear}
        </Badge>

        {/*
          The school name and the city are set as two lines of one heading
          rather than a heading plus a subtitle, so the hero reads as a single
          statement at every width and the city cannot be skipped by a screen
          reader as decoration.
        */}
        <h1 className="display-tight mt-7 text-4xl md:text-5xl">
          <span className="block">{SITE.name}</span>
          <span className="mt-1 block italic opacity-80">
            {SITE.place}.
          </span>
        </h1>

        <p className="mt-7 max-w-[var(--reading-width)] text-lg opacity-85">
          {SITE.motto.english}. Founded {SITE.established}, teaching{" "}
          {SITE.gradeRange} to {SITE.enrolment.total.toLocaleString("en-LK")} boys
          on {SITE.address.street}.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-deep-ink text-deep hover:bg-deep-ink/90"
          >
            <Link href={ROUTES.history}>
              Discover our heritage
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-deep-ink/40 bg-deep-ink text-deep hover:bg-deep-ink/90 hover:text-deep"
          >
            <Link href={ROUTES.admissions}>Admissions</Link>
          </Button>
        </div>

        <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-deep-ink/20 pt-6">
          <div>
            <dt className="field opacity-70">Founded</dt>
            <dd className="mt-1 font-serif text-lg tabular-nums">
              {SITE.establishedYear}
            </dd>
          </div>
          <div>
            <dt className="field opacity-70">Colours</dt>
            <dd className="mt-1 font-serif text-lg">
              {SITE.colours.join(" & ")}
            </dd>
          </div>
          <div>
            <dt className="field opacity-70">Affiliation</dt>
            <dd className="mt-1 font-serif text-lg">{SITE.affiliation}</dd>
          </div>
        </dl>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden bg-panel p-[var(--page-gutter)]">
        <div className="relative w-full max-w-2xl">
          <div className="overflow-hidden rounded-xl border">
            <Image
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          {/*
            Plate numbering, matching the convention the gallery and the credits
            ledger already use, so a photograph cited in prose ("Plate I") can be
            found here. `hero.plate` is set in data/media.ts.
          */}
          <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-quiet-ink">
            Plate {hero.plate} &middot; {hero.alt}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-quiet-ink">
            {hero.credit}
          </p>
        </div>
      </div>
    </section>
  );
}