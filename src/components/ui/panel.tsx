"use client";

import { cn } from "@/lib/utils";

/**
 * The base card.
 *
 * Painted with the opaque `panel` fill, not `panel/60`. With a translucent fill
 * a card resolved to the same colour as the page behind it in light mode, so
 * every card needed its border to exist at all and the page read as one flat
 * sheet. The shadow is now a whisper rather than a lift: elevation is carried
 * by the fill step, and the shadow only separates a raised card from the panel
 * it sits on.
 *
 * Hover deepens the shadow rather than lifting the card, so the affordance
 * survives without any transform.
 */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "card-spotlight card-texture relative overflow-hidden rounded-xl border bg-panel text-panel-ink",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--ink)_6%,transparent)]",
        "transition-shadow duration-[var(--motion-base)] hover:shadow-[0_8px_24px_color-mix(in_srgb,var(--ink)_10%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-serif text-lg font-semibold leading-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-quiet-ink", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}