import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ASSET_BASE, ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";
import { CENTENARY_PROJECT } from "@/data/history";
import { formatDate } from "@/lib/utils";

/**
 * The centenary panel: the two founding years as a date plate, the project's
 * facilities beside it, and the crest as a watermark behind the whole thing.
 *
 * The two years are set stacked rather than as a range because the panel is
 * about a completed centenary and a project for the century after it — reading
 * "1925–2025" would collapse the second half into an end date. Stacking them
 * puts the first year above the second, which is the order the college's own
 * history runs in.
 *
 * The crest is decorative and `aria-hidden`: it is the college's mark, already
 * named in the adjacent text, so announcing it again would add noise rather than
 * information.
 */
export function Centenary() {
  return (
    <section className="band-silver-mid overflow-hidden">
      <div className="shell relative grid gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,22%)_minmax(0,1fr)] lg:gap-14">
        <Image
          src={`${ASSET_BASE}/brand/crest.png`}
          alt=""
          width={512}
          height={512}
          aria-hidden
          className="crest-watermark absolute -right-10 top-1/2 size-80 -translate-y-1/2 lg:size-[28rem]"
        />

        <div className="relative">
          <p className="field text-brand">A century of Nalanda</p>
          <p className="display-tight mt-4 text-6xl leading-none tabular-nums md:text-7xl">
            {SITE.establishedYear}
            <span className="mt-2 block text-4xl opacity-70 md:text-5xl">
              {SITE.centenaryYear}
            </span>
          </p>
          <p className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-quiet-ink">
            {SITE.address.locality} &middot; {SITE.country}
          </p>
        </div>

        <div className="relative">
          <span className="eyebrow-rule" aria-hidden />
          <p className="field mt-5 text-brand">The second century</p>
          <h2 className="display-tight mt-4 text-3xl md:text-4xl">
            {CENTENARY_PROJECT.name}
          </h2>
          <p className="measure mt-5 text-quiet-ink">
            {CENTENARY_PROJECT.summary}
          </p>

          <dl className="mt-9 grid gap-6 sm:grid-cols-2">
            {CENTENARY_PROJECT.facilities.map((facility) => (
              <div key={facility.name}>
                <dt className="font-serif text-lg">{facility.name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-quiet-ink">
                  {facility.detail}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={ROUTES.centenary}
              className="group inline-flex items-center gap-2 text-brand"
            >
              <span className="wipe">Explore the centenary project</span>
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-[var(--motion-base)] group-hover:translate-x-1"
              />
            </Link>
            {CENTENARY_PROJECT.milestones[0] ? (
              <p className="font-mono text-xs text-quiet-ink">
                {formatDate(CENTENARY_PROJECT.milestones[0].date)} &middot;{" "}
                {CENTENARY_PROJECT.milestones[0].label}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}