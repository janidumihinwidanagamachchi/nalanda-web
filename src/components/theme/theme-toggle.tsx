"use client";

import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "@/hooks/use-theme";

/**
 * Light/dark toggle.
 *
 * Renders both icons always and lets CSS pick which is visible, driven by the
 * `data-theme` attribute and the OS media query in globals.css. That is what
 * keeps it hydration-safe: the icon shown does not depend on React state, so
 * the server HTML and the first client render agree even though the server
 * genuinely cannot know the visitor's theme.
 *
 * The label does depend on resolved state, so `aria-label` is deliberately
 * generic ("Switch theme") rather than claiming a direction that may be wrong
 * on first paint.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();

  /*
   * The label states the current theme and the action, rather than just
   * "Switch theme". `useSyncExternalStore` hands back the resolved theme on the
   * first client render, so this is accurate from the first paint; the server
   * cannot know it and renders the neutral fallback, which React reconciles
   * without a hydration error.
   *
   * A `aria-live` region was the obvious alternative and is deliberately not
   * used: live regions nested inside a button are announced unreliably, because
   * the button's accessible name is computed from its subtree, and it would
   * announce "theme set to X" unprompted on every page load. A label that
   * already describes the state is simpler and works with focus.
   */
  const label =
    theme === null
      ? "Switch theme"
      : `Theme: ${theme}. Switch to ${theme === "dark" ? "light" : "dark"}`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`relative grid size-9 shrink-0 place-items-center rounded-lg border text-ink transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand ${className}`}
    >
      {/*
        `aria-hidden` on both: the button carries the accessible name, so
        announcing the glyph as well would make screen readers read out an icon.
        Which one shows is decided in CSS from `data-theme`, not from React
        state, so the server render is never wrong about it.
      */}
      <Sun aria-hidden className="theme-icon-light size-4" weight="bold" />
      <Moon aria-hidden className="theme-icon-dark size-4" weight="bold" />
    </button>
  );
}