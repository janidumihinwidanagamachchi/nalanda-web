"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <Badge variant="danger">Error</Badge>
      <h1 className="display-tight mt-6 max-w-2xl text-4xl md:text-5xl">
        Something on this page failed to load
      </h1>
      <p className="measure mt-6 text-base text-quiet-ink">
        The rest of the site is unaffected. You can try the page again, or start
        from the announcements, which carry the most time-sensitive information.
      </p>

      {error.digest ? (
        <p className="mt-4 font-mono text-xs text-quiet-ink">
          Reference {error.digest}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.announcements}>Announcements</Link>
        </Button>
      </div>

      <Link
        href={ROUTES.home}
        className="wipe mt-8 inline-flex text-sm text-quiet-ink hover:text-brand"
      >
        Or return home
      </Link>
    </div>
  );
}