import Link from "next/link";
import { NAV_SECONDARY, ROUTES } from "@/constants/site";
import { SITE } from "@/data/site";
import { Marquee } from "@/components/motion/marquee";

const MARQUEE_ITEMS = [
  ...SITE.houses.map((h) => h.name),
  "Saukyadana Unit",
  "Buddhist Association",
  "Astronomical Society",
  "Science Society",
  "Commerce Society",
  "Quiz Club",
  "Art Society",
  "Western Cadet Band",
  "Boxing",
  "Aquatics",
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface-sunken">
      <div className="border-b border-line py-6">
        <Marquee speed={52}>
          <div className="flex items-center gap-8 pr-8">
            {MARQUEE_ITEMS.map((name) => (
              <span
                key={name}
                className="whitespace-nowrap font-display text-2xl text-ink-subtle md:text-3xl"
              >
                {name}
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <p className="font-display text-2xl leading-tight">
            {SITE.tagline}
          </p>
          <p className="mt-3 text-sm text-ink-muted">{SITE.motto.pali}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-muted">
            {SITE.address.street}, {SITE.address.locality},{" "}
            {SITE.address.postal}, {SITE.address.country}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {SITE.contact.phoneDisplay}
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-6">
          <FooterHeading>Explore</FooterHeading>
          <ul className="mt-4 space-y-2.5">
            <FooterLink href={ROUTES.academics}>Academics</FooterLink>
            <FooterLink href={ROUTES.admissions}>Admissions</FooterLink>
            <FooterLink href={ROUTES.announcements}>Announcements</FooterLink>
            <FooterLink href={ROUTES.news}>News</FooterLink>
            <FooterLink href={ROUTES.extraCurricular}>Extra Curricular</FooterLink>
            <FooterLink href={ROUTES.history}>History</FooterLink>
          </ul>
        </div>

        <div className="md:col-span-3">
          <FooterHeading>More</FooterHeading>
          <ul className="mt-4 space-y-2.5">
            {NAV_SECONDARY.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <FooterHeading>Official</FooterHeading>
          <ul className="mt-4 space-y-2.5">
            <FooterLink href={SITE.social.facebook} external>
              Facebook
            </FooterLink>
            <FooterLink href={SITE.social.youtube} external>
              YouTube
            </FooterLink>
            <FooterLink href={SITE.social.instagram} external>
              Instagram
            </FooterLink>
            <FooterLink href={SITE.social.linkedin} external>
              LinkedIn
            </FooterLink>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-3 py-6 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SITE.name}, {SITE.address.locality}. Established{" "}
            {SITE.establishedYear}.
          </p>
          <p>
            {year} · Affiliated with the {SITE.affiliation}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
      {children}
    </h2>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "text-sm text-ink-muted transition-colors duration-200 hover:text-accent";

  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={className}
        >
          {children}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}