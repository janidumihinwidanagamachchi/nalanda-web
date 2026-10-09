import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/constants/site";

/**
 * The four routes a visitor is most likely to be looking for, as a silver band
 * between the hero and the narrative sections.
 *
 * The band is a strip rather than four cards because these are shortcuts, not
 * content: each one is a numbered line over a label, so a reader scans the strip
 * in under a second. Card furniture here would make a shortcut look like
 * something worth reading, which is the wrong signal twice over.
 *
 * The fourth entry is the announcements page rather than a student portal. The
 * preview showed a portal link; a school portal needs an account this site does
 * not have, so the slot goes to the route that answers the same question — what
 * is the college telling students today.
 */
const ENTRIES = [
  {
    number: "01",
    label: "Admissions",
    note: "Grade 1 entry, circulars and deadlines",
    href: ROUTES.admissions,
  },
  {
    number: "02",
    label: "Announcements",
    note: "What the college needs you to know this week",
    href: ROUTES.announcements,
  },
  {
    number: "03",
    label: "College calendar",
    note: "Term dates, closures and gatherings",
    href: ROUTES.calendar,
  },
  {
    number: "04",
    label: "Downloads",
    note: "Papers, circulars and forms",
    href: ROUTES.downloads,
  },
] as const;

export function ServiceStrip() {
  return (
    <section className="band-silver" aria-label="College services">
      <div className="shell grid sm:grid-cols-2 lg:grid-cols-4">
        {ENTRIES.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group flex items-start gap-4 border-line px-0 py-7 transition-colors duration-[var(--motion-fast)] sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 lg:px-7"
          >
            <span className="font-mono text-xs tabular-nums text-brand">
              {entry.number}
            </span>
            <span className="flex-1">
              <span className="block font-serif text-lg leading-tight transition-colors duration-[var(--motion-fast)] group-hover:text-brand">
                {entry.label}
              </span>
              <span className="mt-1 block text-sm text-quiet-ink">
                {entry.note}
              </span>
            </span>
            <ArrowRight
              size={16}
              aria-hidden
              className="mt-1 shrink-0 text-quiet-ink transition-transform duration-[var(--motion-base)] group-hover:translate-x-1 group-hover:text-brand"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}