import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "bg-brand text-brand-ink",
  secondary: "bg-alt text-alt-ink",
  outline: "border border-line text-ink",
  ghost: "text-quiet-ink",
  danger: "bg-danger text-danger-ink",
} as const;

type BadgeProps = React.ComponentProps<"span"> & {
  variant?: keyof typeof VARIANTS;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em]",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}