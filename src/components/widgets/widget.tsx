import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The frame every widget sits in.
 *
 * Six independent widgets on one page drift apart fast unless something
 * dictates the padding, the heading size, and where the "see all" link goes.
 * This is that something. It is presentational and renders no client code, so a
 * widget built on it stays a server component unless it has a specific reason
 * not to be.
 */
export function Widget({
  title,
  eyebrow,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  eyebrow?: string;
  /** Rendered top-right. A link to the full page, usually. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** For widgets whose body sets its own rhythm. */
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border bg-panel p-6 md:p-7",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="field text-[0.7rem] uppercase tracking-[0.14em]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 font-serif text-xl leading-snug">{title}</h2>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className={cn("mt-5 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

/** The standard "see everything" affordance, so widgets do not each invent one. */
export function WidgetLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap font-mono text-xs text-brand transition-colors duration-[var(--motion-fast)] hover:text-brand/80"
    >
      {children}
    </Link>
  );
}

/**
 * Placeholder shown while a client-only widget resolves.
 *
 * Sized to roughly the height of the real content so the surrounding grid does
 * not jump when the value arrives. Deliberately empty and marked
 * `aria-hidden`: a skeleton is decoration, and announcing it as content would
 * make screen readers read "Loading" that never resolves to anything useful.
 */
export function WidgetSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", className)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-alt"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}