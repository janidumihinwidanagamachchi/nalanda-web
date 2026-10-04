"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/**
 * The site's one button.
 *
 * A press is acknowledged by an opacity shift rather than a scale: a scale
 * would need a transform on every button in the site to save a single
 * `transform: scale()`, and the acknowledgement is worth more than the motion.
 *
 * Every variant resolves through the token pairs, so a filled button inverts
 * correctly in both themes without a variant-specific colour anywhere.
 */
const VARIANTS = {
  default: "bg-brand text-brand-ink hover:bg-brand/90",
  secondary: "bg-alt text-alt-ink hover:bg-alt/80",
  outline:
    "border border-field bg-canvas hover:border-brand hover:text-brand",
  ghost: "hover:bg-alt hover:text-ink",
  destructive: "bg-danger text-danger-ink hover:bg-danger/90",
  link: "text-brand underline-offset-4 hover:underline",
} as const;

const SIZES = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as the single child element instead of a `<button>`. */
  asChild?: boolean;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-[background-color,color,border-color,opacity] duration-[var(--motion-fast)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:opacity-80",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (asChild) return <Slot className={classes} {...props} />;
  return <button className={classes} {...props} />;
}