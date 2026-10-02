import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import type { MediaSlot } from "@/data/media";

type FrameProps = {
  slot: MediaSlot;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function MediaFrame({ slot, className = "", priority = false, sizes }: FrameProps) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-sunken ${className}`}
    >
      <Image
        src={slot.src}
        alt={slot.alt}
        width={slot.width}
        height={slot.height}
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        className="h-full w-full object-cover"
      />
      {slot.placeholder ? (
        <span className="absolute bottom-2 left-2 rounded-[2px] bg-surface/80 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink-subtle backdrop-blur-sm">
          Placeholder
        </span>
      ) : null}
    </figure>
  );
}

type CardProps = {
  title: string;
  meta?: string;
  body: ReactNode;
  href?: string;
  external?: boolean;
  children?: ReactNode;
  className?: string;
};

export function LinkCard({
  title,
  meta,
  body,
  href,
  external = false,
  children,
  className = "",
}: CardProps) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          {meta ? (
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-subtle">
              {meta}
            </p>
          ) : null}
          <h3 className="mt-2 font-display text-xl leading-snug">{title}</h3>
        </div>
        <span className="mt-1 shrink-0 text-ink-subtle transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1">
          {external ? <ArrowUpRight size={18} /> : <ArrowRight size={18} />}
        </span>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</div>
      {children}
    </>
  );

  const shell = `group block h-full rounded-[var(--radius-card)] border border-line bg-surface-raised p-6 transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-line-strong`;

  if (!href) {
    return <div className={`${shell} ${className}`}>{inner}</div>;
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={`${shell} ${className}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`${shell} ${className}`}>
      {inner}
    </Link>
  );
}

type RowProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function DataRow({ label, value, className = "" }: RowProps) {
  return (
    <div
      className={`grid gap-1 border-t border-line py-5 sm:grid-cols-12 sm:gap-6 ${className}`}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-ink-subtle sm:col-span-4">
        {label}
      </p>
      <div className="sm:col-span-8">{value}</div>
    </div>
  );
}

export function RevealGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>{children}</Reveal>
  );
}