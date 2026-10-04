"use client";

import { useEffect, useState } from "react";
import { Widget, WidgetLink } from "@/components/widgets/widget";
import { WidgetSkeleton } from "@/components/widgets/widget";
import { CALENDAR_EVENTS } from "@/data/pastPrincipals";
import { ROUTES } from "@/constants/site";

/**
 * Counts down to the next dated event.
 *
 * This is the one widget that cannot be prerendered, because a countdown frozen
 * at build time is not a countdown. That constraint dictates the whole shape:
 *
 * The server, and the client's first render, both emit `WidgetSkeleton`. Only a
 * `useEffect` computes the real remaining time. Computing it during render
 * would produce a different number on the server than in the browser — the
 * hydration mismatch this site has already been bitten by once. Rendering a
 * stable placeholder and filling it in after mount is the fix, not a
 * workaround.
 *
 * `remaining` is null until resolved, which is what distinguishes "not yet
 * known" from "zero".
 */
export function CountdownWidget() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [target, setTarget] = useState<{
    date: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();

      // Compare against the start of today so that an event happening later
      // today still counts down rather than reading as already past.
      const todayKey = new Date(now).toISOString().slice(0, 10);
      const next = CALENDAR_EVENTS.find((event) => event.date >= todayKey);

      if (!next) {
        setTarget(null);
        setRemaining(null);
        return;
      }

      setTarget({ date: next.date, label: next.label });
      setRemaining(new Date(`${next.date}T00:00:00`).getTime() - now);
    };

    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Widget
      title="Next event"
      eyebrow="Countdown"
      action={<WidgetLink href={ROUTES.calendar}>Full dates</WidgetLink>}
    >
      {remaining === null || target === null ? (
        <WidgetSkeleton lines={2} />
      ) : remaining <= 0 ? (
        <p className="text-sm">
          <span className="field block text-xs">Now</span>
          {target.label} is under way or has passed.
        </p>
      ) : (
        <div>
          <span className="field block text-xs">{target.label}</span>
          <p className="display-tight mt-2 text-3xl tabular-nums">
            {describeRemaining(remaining)}
          </p>
        </div>
      )}
    </Widget>
  );
}

/**
 * Splits a millisecond gap into the two units worth showing.
 *
 * Days are the headline; hours only appear once it is under a day, because
 * "14 days" is the useful fact and "14 days 6 hours" is not. Minutes are left
 * out entirely — nobody needs a countdown that ticks every minute in a number
 * too small to notice.
 */
function describeRemaining(ms: number): string {
  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);

  if (days >= 1) return `${days} day${days === 1 ? "" : "s"}`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const minutes = Math.max(1, totalMinutes);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}