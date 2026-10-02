"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { ROUTES } from "@/constants/site";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error", error);
  }, [error]);

  return (
    <div className="shell flex min-h-[70dvh] flex-col justify-center py-24">
      <p className="font-mono text-sm tracking-[0.2em] text-accent">Error</p>
      <h1 className="display-tight mt-6 max-w-2xl text-4xl md:text-5xl">
        Something on this page failed to load
      </h1>
      <p className="measure mt-6 text-base leading-relaxed text-ink-muted">
        The rest of the site is unaffected. You can try the page again, or start
        from the announcements, which carry the most time-sensitive information.
      </p>

      {error.digest ? (
        <p className="mt-4 font-mono text-xs text-ink-subtle">
          Reference {error.digest}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <MagneticButton onClick={reset} variant="solid">
          Try again
        </MagneticButton>
        <MagneticButton href={ROUTES.announcements} variant="outline">
          Announcements
        </MagneticButton>
      </div>

      <Link
        href={ROUTES.home}
        className="mt-8 inline-flex text-sm text-ink-muted underline underline-offset-4 transition-colors hover:text-accent"
      >
        Or return home
      </Link>
    </div>
  );
}