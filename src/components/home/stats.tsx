import { STATS } from "@/data/site";
import { Card } from "@/components/ui/panel";

/**
 * Four numbers, on panels rather than a bare rule-separated row so the band
 * reads as part of the card system instead of a table that lost its borders.
 *
 * The houses were also listed in a sentence under this grid, repeating the four
 * names the fourth card already carries. The band now says each thing once.
 */
export function Stats() {
  return (
    <section className="shell -mt-10 pb-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="field">{stat.label}</p>
            <p className="display-tight mt-3 text-4xl tabular-nums">
              {stat.value.toLocaleString("en-LK")}
            </p>
            <p className="mt-2 text-sm text-quiet-ink">{stat.detail}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}