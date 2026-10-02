export default function Loading() {
  return (
    <div
      className="shell py-24"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="h-3 w-40 animate-pulse rounded-[2px] bg-line" />
      <div className="mt-8 h-14 w-3/4 animate-pulse rounded-[2px] bg-line" />
      <div className="mt-4 h-14 w-1/2 animate-pulse rounded-[2px] bg-line" />
      <div className="mt-10 max-w-xl space-y-3">
        <div className="h-4 animate-pulse rounded-[2px] bg-line" />
        <div className="h-4 w-11/12 animate-pulse rounded-[2px] bg-line" />
        <div className="h-4 w-8/12 animate-pulse rounded-[2px] bg-line" />
      </div>
      <div className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-8 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-3 w-16 animate-pulse rounded-[2px] bg-line" />
            <div className="h-9 w-24 animate-pulse rounded-[2px] bg-line" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading&hellip;</span>
    </div>
  );
}