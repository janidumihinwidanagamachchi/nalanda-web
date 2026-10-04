import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section";

/**
 * Vision, mission and motto, with the principal's name.
 *
 * The motto sits in its own panel rather than inline with the vision because it
 * is the one line on the site that is a quotation, and giving it a frame is the
 * only way a reader can tell it apart from the college's own prose.
 */
export function About() {
  return (
    <section className="shell py-16 md:py-24">
      <SectionHeader
        eyebrow="About the college"
        title="What the college sets out to do"
        lede={`${SITE.type} for ${SITE.gender.toLowerCase()}s, under the ${SITE.affiliation}, in the ${SITE.address.zone}.`}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Card className="p-8">
          <p className="field">Vision</p>
          <p className="mt-4 text-lg">{SITE.vision}</p>
        </Card>

        <Card className="p-8">
          <p className="field">Mission</p>
          <p className="mt-4 text-lg">{SITE.mission}</p>
        </Card>

        <Card className="p-8">
          <p className="field">Motto</p>
          <p className="mt-4 font-serif text-2xl leading-snug">
            {SITE.motto.pali}
          </p>
          <p className="mt-3 text-sm text-quiet-ink">{SITE.motto.english}</p>
          <p className="mt-4 font-mono text-xs text-quiet-ink">
            {SITE.motto.provenance}
          </p>
        </Card>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-xl border bg-panel p-6">
        <div>
          <p className="field">Principal</p>
          <p className="mt-2 font-serif text-xl">{SITE.principal}</p>
        </div>
        <Button asChild variant="ghost">
          <Link href={ROUTES.about}>
            About the college
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </section>
  );
}