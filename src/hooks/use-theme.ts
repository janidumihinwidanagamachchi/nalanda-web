"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "nalanda-theme";

/**
 * Theme as an external store rather than React state.
 *
 * The theme genuinely lives outside React: the inline script in layout.tsx sets
 * `data-theme` on the root element before first paint, and the OS media query
 * in globals.css resolves it when nothing is stored. This hook reads that source
 * directly.
 *
 * `useSyncExternalStore` is the mechanism that makes it safe. The server cannot
 * know the visitor's theme, so it returns the neutral `null`; on the client the
 * real value is read immediately, during render, and React reconciles the two
 * without treating the difference as a mismatch — which is precisely the
 * hydration crash this site has already hit once.
 *
 * Reading it in an effect instead would mean a second render pass on every page
 * load to discover something the DOM already knew, and React's own lint rule
 * flags that pattern for good reason.
 */

function getSnapshot(): Theme | null {
  if (typeof document === "undefined") return null;

  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;

  // Nothing stored, so globals.css fell through to the OS. Mirror that, or the
  // toggle would report the opposite of what is on screen.
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Always the same value on the server. React compares this against the first
 * client snapshot and, finding them unequal, treats it as a store change rather
 * than a hydration error.
 */
function getServerSnapshot(): Theme | null {
  return null;
}

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  // Fires when the OS switches, and when `setTheme` announces that the
  // `data-theme` attribute changed. Without the second one the toggle would
  // keep reporting the pre-click theme until something else forced a re-read.
  const custom = "nalanda-theme-change";
  media.addEventListener("change", onChange);
  window.addEventListener(custom, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(custom, onChange);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing or a full quota. The theme still applies to this page
      // via the attribute above; it just will not be remembered next visit.
    }
    // The attribute change is not observed by the store above, so announce it
    // manually to keep subscribers in step with the DOM.
    window.dispatchEvent(new Event("nalanda-theme-change"));
  }, []);

  const toggle = useCallback(() => {
    const current =
      document.documentElement.getAttribute("data-theme") ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(current === "dark" ? "light" : "dark");
  }, [setTheme]);

  return useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);
}