import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ImageSquare } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import type { MediaSlot } from "@/data/media";

/**
 * Domain-level cards. `Card` is the generic panel; these add the link and
 * metadata behaviour the site's content needs.
 */

/**
 * A photograph the school has not supplied yet.
 *
 * The earlier version pointed these slots at `picsum.photos`, which put
 * photographs of unrelated places and objects on a school site under a caption
 * describing the college's own buildings. A wrong photograph is worse than no
 * photograph: it looks like a real record of something that never happened.
 *
 * So an empty slot now renders as an empty slot — a drawn frame naming what is
 * being waited on. The image returns when the archive does.
 */
export function AwaitingPlate({
  slot,
  className,
}: {
  slot: MediaSlot;
  className?: string;
}) {
  // Placeholder alts are written "Placeholder: the college pavilion", so the
  // prefix is stripped and the remainder becomes the caption rather than being
  // repeated as a label.
  const subject = slot.alt.replace(/^Placeholder:\s*/i, "");

  return (
    <div
      className={cn(
        "plate-awaiting flex-col gap-3 px-6 text-center",
        className,
      )}
    >
      <ImageSquare size={22} className="text-quiet-ink" aria-hidden />
      <span className="field">Awaiting photograph</span>
      <span className="max-w-[24ch] text-sm text-quiet-ink">{subject}</span>
    </div>
  );
}

type FrameProps = {
  slot: MediaSlot;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function MediaFrame({
  slot,
  className,
  priority = false,
  sizes,
}: FrameProps) {
  if (slot.placeholder) {
    return <AwaitingPlate slot={slot} className={className} />;
  }

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-xl border bg-alt",
        className,
      )}
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
  className,
}: CardProps) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          {meta ? <p className="field">{meta}</p> : null}
          <h3 className="mt-3 font-serif text-xl leading-snug">{title}</h3>
        </div>
        <span className="mt-1 shrink-0 text-quiet-ink transition-transform duration-[var(--motion-base)] group-hover:translate-x-1">
          {external ? <ArrowUpRight size={18} /> : <ArrowRight size={18} />}
        </span>
      </div>
      <div className="mt-4 text-sm text-quiet-ink">{body}</div>
      {children}
    </>
  );

  if (!href) {
    return (
      <Card className={cn("h-full p-6", className)}>
        <div className="h-full">{inner}</div>
      </Card>
    );
  }

  if (external) {
    return (
      <Card className={cn("group h-full p-6", className)}>
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {inner}
        </a>
      </Card>
    );
  }

  return (
    <Card className={cn("group h-full p-6", className)}>
      <Link
        href={href}
        className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {inner}
      </Link>
    </Card>
  );
}

export function DataRow({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-2 border-t border-line py-5 sm:grid-cols-12 sm:gap-6",
        className,
      )}
    >
      <p className="field sm:col-span-4">{label}</p>
      <div className="sm:col-span-8">{value}</div>
    </div>
  );
}