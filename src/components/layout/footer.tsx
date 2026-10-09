import Link from "next/link";
import { NAV_FOOTER, NAV_INTERNAL, ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";

/**
 * The site footer.
 *
 * Columns come from `NAV_FOOTER`, which is assembled in constants/site.ts out of
 * the same lists the header uses. The footer previously kept its own third copy
 * of the link list, which is how "Credits" and "Widgets" ended up footer
 * entries while "Campus" was missing from the column next to them.
 *
 * The two routes that exist but are not part of the information flow — the
 * widgets page and the credits ledger — are listed once at the bottom under
 * their own heading, rather than being mixed in with places a visitor is
 * looking for.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-alt">
      {/*
        The motto band, in the darker maroon, running full width above the
        columns. It closes the page on the one line that identifies the college,
        with the founding year set as a plate beside it — the same pairing the
        preview uses, where the year is treated as a date of record rather than
        as body copy.
      */}
      <div className="bg-deep text-deep-ink">
        <div className="shell flex flex-wrap items-center justify-between gap-8 py-12">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] opacity-75">
              {SITE.name} &middot; {SITE.address.locality}
            </p>
            <p className="mt-3 font-serif text-2xl italic">{SITE.motto.english}</p>
          </div>
          <Link
            href={ROUTES.history}
            className="group flex items-baseline gap-4 text-center"
          >
            <span className="field opacity-75">Established</span>
            <span className="display-tight text-5xl tabular-nums">
              {SITE.establishedYear}
            </span>
            <span className="field opacity-0 transition-opacity duration-[var(--motion-base)] group-hover:opacity-75 group-focus-visible:opacity-75">
              History
            </span>
          </Link>
        </div>
      </div>

      <div className="shell py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-serif text-lg">{SITE.name}</h2>
            <p className="mt-1 text-sm text-quiet-ink">{SITE.tagline}</p>
            <address className="mt-4 text-sm text-quiet-ink not-italic">
              {SITE.address.street}
              <br />
              {SITE.address.locality}, {SITE.country}
            </address>
            <p className="mt-4 text-sm">
              <a href={`tel:${SITE.contact.phone}`} className="wipe text-brand">
                {SITE.contact.phoneDisplay}
              </a>
              <br />
              <a href={`mailto:${SITE.contact.email}`} className="wipe text-brand">
                {SITE.contact.email}
              </a>
            </p>
          </div>

          {NAV_FOOTER.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="field">{column.heading}</h2>
              <ul className="mt-4 grid gap-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-quiet-ink transition-colors duration-[var(--motion-fast)] hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="rule mt-16" />

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
          <p className="text-sm text-quiet-ink">
            &copy; {SITE.establishedYear}&ndash;{year} {SITE.name}. Established{" "}
            {SITE.established}, affiliated with the {SITE.affiliation}.
          </p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV_INTERNAL.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.note}
                  className="font-mono text-xs uppercase tracking-[0.14em] text-quiet-ink transition-colors duration-[var(--motion-fast)] hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}