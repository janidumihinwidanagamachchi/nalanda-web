import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Shared page furniture. Every route is assembled from these, which is why the
 * eyebrow, the title ramp and the lede measure are identical across twenty-two
 * pages without any page having to repeat the classes.
 */

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
      <h2 className="display-tight mt-4 text-3xl md:text-4xl">{title}</h2>
      {lede ? <p className="measure mt-4 text-base text-quiet-ink">{lede}</p> : null}
    </div>
  );
}

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("prose-body text-base", className)}>{children}</div>
  );
}

/**
 * A caveat the reader must not skim past. Used where a fact is genuinely
 * unknown rather than merely unwritten, so it takes a dashed edge instead of
 * the solid one a real note would get.
 */
export function Note({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "flagged";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        tone === "flagged"
          ? "border-dashed border-field bg-alt text-quiet-ink"
          : "border-line bg-panel text-quiet-ink",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="shell pt-16 pb-12 md:pt-24 md:pb-16">
      <Badge variant="secondary">{eyebrow}</Badge>
      <h1 className="display-tight mt-5 max-w-4xl text-4xl md:text-5xl">
        {title}
      </h1>
      {lede ? (
        <p className="measure mt-6 text-lg text-quiet-ink">{lede}</p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("shell py-16 md:py-24", className)}>
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
}) {
  return (
    <div>
      <p className="field">{label}</p>
      <p className="display-tight mt-3 text-3xl md:text-4xl">{value}</p>
      {detail ? <p className="mt-2 text-sm text-quiet-ink">{detail}</p> : null}
    </div>
  );
}