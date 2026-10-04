import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditional class names with Tailwind conflict resolution, so a caller's
 * `className` can override a component's defaults (e.g. `px-3` beating `px-6`)
 * instead of both landing in the DOM and the winner depending on stylesheet
 * order.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date as "12 Mar 2026" for display.
 *
 * `timeZone: "UTC"` is not cosmetic. Every date in this project is a bare
 * `YYYY-MM-DD` string, which `Date` parses as UTC midnight. Formatting that
 * without pinning the zone renders in whatever zone the code happens to run
 * in, so a build on a UTC machine says "12 Mar 2026" and a visitor in New York
 * says "11 Mar 2026". On a statically exported page that is a hydration
 * mismatch, and for a server component it is simply the wrong date.
 *
 * Pinning to UTC makes the output a pure function of the input string, which is
 * what every call site assumes it is.
 *
 * This is the single date formatter for the project. It previously had three
 * near-identical local copies, one of which had drifted to a different day
 * width — which is how the timezone hazard survived review in the first place.
 * `month` exists so the admissions timeline can spell the month out without
 * reintroducing a variant.
 */
export function formatDate(
  date: string | Date,
  { month = "short" }: { month?: "short" | "long" } = {},
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}