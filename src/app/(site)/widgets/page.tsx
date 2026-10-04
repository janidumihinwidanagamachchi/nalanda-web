import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui/section";
import { UpcomingEventsWidget } from "@/components/widgets/upcoming-events";
import { CountdownWidget } from "@/components/widgets/countdown";
import { AnnouncementTickerWidget } from "@/components/widgets/announcement-ticker";
import { LatestNewsWidget } from "@/components/widgets/upcoming-events";
import { NewsletterSignupWidget } from "@/components/widgets/newsletter-signup";
import { WeatherWidget } from "@/components/widgets/weather";
import { Note } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Widgets",
  description:
    "Dates, notices, news and conditions in one place, gathered from across the site.",
};

/**
 * Every widget on one page.
 *
 * The build timestamp is resolved once here and passed to the widgets that
 * filter by date, so they cannot disagree with each other about what "upcoming"
 * means. The countdown and weather widgets ignore it on purpose: they recompute
 * in the browser precisely because a build-time value would be stale.
 */
export default function WidgetsPage() {
  const now = new Date().toISOString();

  return (
    <>
      <PageHeader
        eyebrow="Widgets"
        title="The short version"
        lede="What is happening soon, what needs saying now, and what is new — gathered from across the site."
      />

      <Section className="pt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CountdownWidget />
          <UpcomingEventsWidget now={now} />
          <AnnouncementTickerWidget now={now} />
          <LatestNewsWidget />
          <WeatherWidget />
          <NewsletterSignupWidget />
        </div>
      </Section>

      <Section className="pt-0">
        <Note className="max-w-3xl">
          Dates and notices are filtered against the date this site was last
          built, so they may lag a live deadline by one build. The countdown
          and the weather are read in your browser and stay current. Weather
          data comes from Open-Meteo, which sees your IP address as any web
          service does.
        </Note>
      </Section>
    </>
  );
}