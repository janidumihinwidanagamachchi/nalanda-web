import { Hero } from "./hero";
import { ServiceStrip } from "./service-strip";
import { Stats } from "./stats";
import { Centenary } from "./centenary";
import { About } from "./about";
import { NewsNotices } from "./news-notices";
import { Activities } from "./activities";
import { Photographs } from "./photographs";
import { QuickLinks } from "./quick-links";
import { SectionHeader } from "@/components/ui/section";
import { CountdownWidget } from "@/components/widgets/countdown";
import { UpcomingEventsWidget } from "@/components/widgets/upcoming-events";
import { WeatherWidget } from "@/components/widgets/weather";
import { NewsletterSignupWidget } from "@/components/widgets/newsletter-signup";
import { ROUTES } from "@/constants/site";
import Link from "next/link";

/**
 * Section order is deliberate. The hero answers what this is; the service strip
 * answers where a parent goes next; the stats give scale; the about block states
 * purpose; then news, then the activities a parent is checking, then a band of
 * photographs as a visual pause, then the routes that do not fit a narrative.
 *
 * The centenary panel sits between the photographs and the widgets because it is
 * the one section that is about the college's second century rather than its
 * present, and the widget band is the most perishable content on the page — it
 * wants to be late in the scroll, where it does not push the durable sections
 * down.
 */
export function HomeSurface() {
  const now = new Date().toISOString();

  return (
    <>
      <Hero />
      <ServiceStrip />
      <Stats />
      <About />
      <NewsNotices />
      <Activities />
      <Photographs />
      <Centenary />

      <section className="shell py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="At a glance"
            title="What is happening now"
            lede="Dates, deadlines and conditions, gathered from across the site."
          />
          <Link
            href={ROUTES.widgets}
            className="mb-2 font-mono text-xs text-brand underline underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-brand/80"
          >
            All widgets
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CountdownWidget />
          <UpcomingEventsWidget now={now} />
          <WeatherWidget />
          <NewsletterSignupWidget />
        </div>
      </section>

      <QuickLinks />
    </>
  );
}