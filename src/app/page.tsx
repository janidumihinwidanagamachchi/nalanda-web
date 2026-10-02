
import { MaskedText } from "@/components/motion/masked-text";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { STATS, SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export default function Home() {
  return (
    <div>
      <section className="shell flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-20 md:min-h-[calc(100dvh-4.5rem)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
          Colombo · Established {SITE.establishedYear}
        </p>
        <MaskedText
          as="h1"
          text={SITE.tagline}
          animateOnMount
          className="display-tight mt-6 max-w-4xl text-5xl md:text-6xl lg:text-7xl"
        />
        <Reveal delay={0.25} className="mt-8 max-w-xl">
          <p className="measure text-base leading-relaxed text-ink-muted">
            {SITE.vision}
          </p>
        </Reveal>
        <Reveal delay={0.35} className="mt-10 flex flex-wrap gap-3">
          <MagneticButton href={ROUTES.admissions} variant="solid">
            Admissions
          </MagneticButton>
          <MagneticButton href={ROUTES.history} variant="outline">
            Our history
          </MagneticButton>
        </Reveal>

        <Reveal delay={0.5} className="mt-20">
          <dl className="grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-ink-subtle">
                  {s.label}
                </dt>
                <dd className="mt-2 font-display text-4xl">
                  <CountUp value={s.value} />
                </dd>
                <p className="mt-1 text-xs text-ink-subtle">{s.detail}</p>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>
    </div>
  );
}