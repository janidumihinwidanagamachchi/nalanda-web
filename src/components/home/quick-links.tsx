import Link from "next/link";
import { ROUTES } from "@/constants/site";
import { Card } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section";

/**
 * The routes that would otherwise be reachable only from the footer's third
 * column. Six cards is the ceiling before this becomes a second navigation and
 * stops being a shortcut.
 */
const GROUPS = [
  {
    title: "Apply",
    links: [
      { label: "Admissions", href: ROUTES.admissions, note: "How entry works" },
      { label: "Academics", href: ROUTES.academics, note: "Grades 1 to 13" },
      { label: "Downloads", href: ROUTES.downloads, note: "Papers and circulars" },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Campus", href: ROUTES.campus, note: "Siri Dhamma Mawatha" },
      { label: "Gallery", href: ROUTES.gallery, note: "A hundred years" },
      { label: "Contact", href: ROUTES.contact, note: "Reach the college" },
    ],
  },
  {
    title: "Belong",
    links: [
      { label: "Old Nalandians", href: ROUTES.alumni, note: "Alumni" },
      { label: "Community", href: ROUTES.community, note: "Bodies around the college" },
      { label: "Calendar", href: ROUTES.calendar, note: "Dates" },
    ],
  },
  {
    title: "Follow",
    links: [
      { label: "Channels", href: ROUTES.channels, note: "Every official channel" },
      { label: "Newsletter", href: ROUTES.newsletter, note: "The bulletin" },
      { label: "Societies and clubs", href: ROUTES.extraCurricular, note: "Outside the classroom" },
    ],
  },
] as const;

export function QuickLinks() {
  return (
    <section className="shell py-16 md:py-24">
      <SectionHeader
        eyebrow="Everywhere else"
        title="The rest of the site"
        lede="Twenty-two pages, grouped by what you came here to do."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((group) => (
          <Card key={group.title} className="p-6">
            <h3 className="field">{group.title}</h3>
            <ul className="mt-5 grid gap-4">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="wipe font-medium transition-colors duration-[var(--motion-fast)] hover:text-brand"
                  >
                    {link.label}
                  </Link>
                  <p className="mt-1 text-sm text-quiet-ink">{link.note}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}