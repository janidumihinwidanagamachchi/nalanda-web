import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SPORTS, SOCIETIES } from "@/data/extraCurricular";
import { CENTENARY_PROJECT } from "@/data/history";
import { ROUTES } from "@/constants/site";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

/** Sport, society and centenary panels, side by side. */
export function Activities() {
  return (
    <section className="shell py-16 md:py-24">
      <SectionHeader
        eyebrow="Beyond the classroom"
        title="Sport, societies, and the second century"
        lede="What happens outside the classroom, and what is being built for the hundred years after the centenary."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col p-7">
          <h3 className="font-serif text-xl">Sport</h3>
          <ul className="mt-5 grid flex-1 gap-4">
            {SPORTS.slice(0, 5).map((sport) => (
              <li key={sport.name}>
                <p className="font-medium">{sport.name}</p>
                <p className="mt-1 text-sm text-quiet-ink">{sport.detail}</p>
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-6 justify-self-start">
            <Link href={ROUTES.sports}>All sport</Link>
          </Button>
        </Card>

        <Card className="flex flex-col p-7">
          <h3 className="font-serif text-xl">Societies</h3>
          <p className="mt-2 text-sm text-quiet-ink">
            {SOCIETIES.length} listed, across media, science, academic and service
            groups.
          </p>
          <ul className="mt-5 grid flex-1 gap-2">
            {SOCIETIES.slice(0, 8).map((society) => (
              <li key={society.name} className="text-sm">
                {society.link ? (
                  <a
                    href={society.link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="wipe inline-flex items-center gap-1 text-brand"
                  >
                    {society.name}
                    <ArrowUpRight size={13} />
                  </a>
                ) : (
                  society.name
                )}
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-6 justify-self-start">
            <Link href={ROUTES.societies}>All societies</Link>
          </Button>
        </Card>

        <Card className="flex flex-col p-7">
          <Badge variant="secondary" className="self-start">
            Centenary project
          </Badge>
          <h3 className="mt-4 font-serif text-xl">
            {CENTENARY_PROJECT.name}
          </h3>
          <p className="mt-3 text-sm text-quiet-ink">
            {CENTENARY_PROJECT.summary}
          </p>
          <ul className="mt-5 grid flex-1 gap-4">
            {CENTENARY_PROJECT.facilities.map((facility) => (
              <li key={facility.name}>
                <p className="font-medium">{facility.name}</p>
                <p className="mt-1 text-sm text-quiet-ink">{facility.detail}</p>
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-6 justify-self-start">
            <Link href={ROUTES.centenary}>Centenary</Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}