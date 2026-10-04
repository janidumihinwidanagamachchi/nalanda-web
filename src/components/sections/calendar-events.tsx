import { Section, Note } from "@/components/ui/section";
import { CALENDAR_EVENTS, CALENDAR_NOTE } from "@/data/pastPrincipals";
import { formatDate } from "@/lib/utils";

export function CalendarEvents() {
  return (
    <Section>
      <h2 className="field">Confirmed dates</h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {CALENDAR_EVENTS.map((event) => (
          <div
            key={event.date + event.label}
            className="grid gap-2 py-5 sm:grid-cols-12 sm:gap-8"
          >
            <p className="font-mono text-xs text-brand sm:col-span-4">
              {formatDate(event.date, { month: "long" })}
            </p>
            <p className="text-sm sm:col-span-6">{event.label}</p>
            <p className="text-xs text-quiet-ink sm:col-span-2">{event.kind}</p>
          </div>
        ))}
      </div>
      <Note tone="flagged" className="mt-10 max-w-3xl">
        {CALENDAR_NOTE}
      </Note>
    </Section>
  );
}