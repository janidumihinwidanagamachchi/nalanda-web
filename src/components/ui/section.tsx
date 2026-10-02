import type { ReactNode } from "react";

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
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="display-tight mt-3 text-3xl md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {lede ? (
        <p className="measure mt-4 text-base leading-relaxed text-ink-muted">
          {lede}
        </p>
      ) : null}
    </div>
  );
}

type ProseProps = {
  children: ReactNode;
  className?: string;
};

export function Prose({ children, className = "" }: ProseProps) {
  return (
    <div
      className={`measure space-y-5 text-base leading-relaxed text-ink-muted ${className}`}
    >
      {children}
    </div>
  );
}

type NoteProps = {
  children: ReactNode;
  tone?: "neutral" | "flagged";
  className?: string;
};

export function Note({ children, tone = "neutral", className = "" }: NoteProps) {
  const base =
    "rounded-[var(--radius-card)] border px-4 py-3 text-sm leading-relaxed";
  const style =
    tone === "flagged"
      ? "border-dashed border-line-strong bg-surface-sunken text-ink-muted"
      : "border-line bg-surface-raised text-ink-muted";
  return <p className={`${base} ${style} ${className}`}>{children}</p>;
}

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: PageHeaderProps) {
  return (
    <header className="shell pt-16 pb-12 md:pt-24 md:pb-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
        {eyebrow}
      </p>
      <h1 className="display-tight mt-4 max-w-4xl text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {lede ? (
        <p className="measure mt-6 text-lg leading-relaxed text-ink-muted">
          {lede}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`shell py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function Stat({ label, value, detail }: {
  label: string;
  value: ReactNode;
  detail?: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-ink-subtle">{label}</p>
      <p className="mt-2 font-display text-3xl md:text-4xl">{value}</p>
      {detail ? <p className="mt-1 text-xs text-ink-subtle">{detail}</p> : null}
    </div>
  );
}