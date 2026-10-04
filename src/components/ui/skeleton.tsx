export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-8 md:grid-cols-2"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4">
          <div className="aspect-[3/2] animate-pulse rounded-xl bg-line" />
          <div className="flex gap-3">
            <div className="h-4 w-20 animate-pulse rounded-[2px] bg-line" />
            <div className="h-4 w-16 animate-pulse rounded-[2px] bg-line" />
          </div>
          <div className="h-6 w-4/5 animate-pulse rounded-[2px] bg-line" />
          <div className="h-4 w-full animate-pulse rounded-[2px] bg-line" />
          <div className="h-4 w-3/5 animate-pulse rounded-[2px] bg-line" />
        </div>
      ))}
      <span className="sr-only">Loading&hellip;</span>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="divide-y divide-line border-y border-line"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid gap-3 py-6 sm:grid-cols-12 sm:gap-8">
          <div className="h-3 w-24 animate-pulse rounded-[2px] bg-line sm:col-span-3" />
          <div className="space-y-2 sm:col-span-9">
            <div className="h-5 w-2/3 animate-pulse rounded-[2px] bg-line" />
            <div className="h-3 w-full animate-pulse rounded-[2px] bg-line" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading&hellip;</span>
    </div>
  );
}