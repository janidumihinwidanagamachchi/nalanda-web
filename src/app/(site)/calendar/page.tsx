import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/section";
import { CalendarEvents } from "@/components/sections/calendar-events";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Calendar",
  description: `Confirmed dates and deadlines published by ${SITE.name}, Colombo.`,
};

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title="Dates"
        lede="Only dates that are fixed by circular or already published are listed here. The academic calendar itself changes each year."
      />
      <CalendarEvents />
    </>
  );
}