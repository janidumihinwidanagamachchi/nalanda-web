import { Section, Note } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { CALENDAR_EVENTS, CALENDAR_NOTE } from "@/data/pastPrincipals";

export function CalendarEvents() {
  return (
    <Section>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
        Confirmed dates
      </h2>
      <Stagger className="mt-6 divide-y divide-line border-y border-line">
        {CALENDAR_EVENTS.map((event) => (
          <StaggerItem
            key={event.date + event.label}
            className="grid gap-2 py-5 sm:grid-cols-12 sm:gap-8"
          >
            <p className="font-mono text-xs text-accent sm:col-span-4">
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm sm:col-span-6">{event.label}</p>
            <p className="text-xs text-ink-subtle sm:col-span-2">{event.kind}</p>
          </StaggerItem>
        ))}
      </Stagger>
      <Note tone="flagged" className="mt-10 max-w-3xl">
        {CALENDAR_NOTE}
      </Note>
    </Section>
  );
}