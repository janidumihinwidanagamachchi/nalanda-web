"use client";

import { cn } from "@/lib/utils";

/**
 * The category filter used by both news and announcements.
 *
 * This replaced a `layoutId` pill that slid between tabs. With no animation in
 * the language the active state is a plain filled background, which is the
 * whole of what the pill communicated.
 *
 * The row scrolls horizontally on narrow screens rather than wrapping, because
 * four categories wrapping to two rows pushes the content it filters below the
 * fold on a phone.
 */
export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div
      className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0"
      role="tablist"
      aria-label={label}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm",
              "transition-colors duration-[var(--motion-fast)]",
              active
                ? "bg-brand text-brand-ink"
                : "bg-alt text-alt-ink hover:bg-highlight hover:text-highlight-ink",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}