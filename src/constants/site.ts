export const Z = {
  base: 0,
  raised: 10,
  sticky: 100,
  nav: 200,
  overlay: 300,
  modal: 400,
  grain: 500,
} as const;

/**
 * Public files in /public are served from the deployment subpath, so every
 * reference to one from TypeScript must carry the prefix. next/link adds
 * basePath by itself, but next/image does not when images.unoptimized is set,
 * which is why the crest and the gallery photographs were 404ing on the Pages
 * subpath. Must match basePath in next.config.ts.
 */
export const ASSET_BASE = "/nalanda-web";

export const ROUTES = {
  home: "/",
  about: "/about",
  history: "/history",
  pastPrincipals: "/past-principals",
  centenary: "/centenary",
  academics: "/academics",
  admissions: "/admissions",
  announcements: "/announcements",
  news: "/news",
  extraCurricular: "/extra-curricular",
  clubs: "/extra-curricular/clubs",
  societies: "/extra-curricular/societies",
  sports: "/extra-curricular/sports",
  community: "/community",
  channels: "/channels",
  downloads: "/downloads",
  gallery: "/gallery",
  calendar: "/calendar",
  alumni: "/alumni",
  campus: "/campus",
  newsletter: "/newsletter",
  contact: "/contact",
  widgets: "/widgets",
  credits: "/credits",
} as const;

/**
 * Site navigation.
 *
 * One definition, consumed by the header, the footer and the mobile drawer, so
 * a route cannot appear in one and be missing from another. The previous
 * arrangement had three independent lists — the header's own, the footer's, and
 * these — which had already drifted apart: the header showed "Scores" and
 * "Societies" as top-level items while the dropdowns defined here were never
 * rendered at all.
 *
 * The shape is "a small number of places, each of which can contain others".
 * A reader looking for societies is looking under Extra-Curricular, and a reader
 * looking for the college's story is looking under About; anything that does not
 * belong to one of those six goes in the utility column rather than being
 * promoted into the header.
 */
export type NavChild = { label: string; href: string; note?: string };
export type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
};

/** The six places the header offers. Children render as a dropdown. */
export const NAV_PRIMARY: readonly NavItem[] = [
  {
    label: "About",
    href: ROUTES.about,
    children: [
      { label: "About the college", href: ROUTES.about },
      { label: "History", href: ROUTES.history },
      { label: "Past principals", href: ROUTES.pastPrincipals },
      { label: "Centenary", href: ROUTES.centenary },
      { label: "Campus", href: ROUTES.campus },
    ],
  },
  { label: "Academics", href: ROUTES.academics },
  { label: "Admissions", href: ROUTES.admissions },
  { label: "Announcements", href: ROUTES.announcements },
  { label: "News", href: ROUTES.news },
  {
    label: "Extra-Curricular",
    href: ROUTES.extraCurricular,
    children: [
      { label: "Societies", href: ROUTES.societies },
      { label: "Clubs", href: ROUTES.clubs },
      { label: "Sports", href: ROUTES.sports },
    ],
  },
];

/**
 * Everything else, grouped for the footer and the drawer's lower half.
 *
 * Grouped by who is looking for it rather than alphabetically, because "a
 * parent looking for a term date" and "an old boy looking for the newsletter"
 * are not the same search.
 */
export const NAV_UTILITY: readonly NavItem[] = [
  { label: "Community", href: ROUTES.community },
  { label: "Alumni", href: ROUTES.alumni },
  { label: "Channels", href: ROUTES.channels },
  { label: "Gallery", href: ROUTES.gallery },
  { label: "Calendar", href: ROUTES.calendar },
  { label: "Downloads", href: ROUTES.downloads },
  { label: "Newsletter", href: ROUTES.newsletter },
  { label: "Contact", href: ROUTES.contact },
];

/** Footer columns, assembled from the same two lists. */
export const NAV_FOOTER: readonly { heading: string; items: readonly NavItem[] }[] = [
  {
    heading: "The college",
    items: [NAV_PRIMARY[0], NAV_PRIMARY[1], NAV_PRIMARY[3], NAV_PRIMARY[4]],
  },
  {
    heading: "Joining and studying",
    items: [NAV_PRIMARY[2], NAV_UTILITY[5], NAV_UTILITY[4], NAV_UTILITY[3]],
  },
  {
    heading: "Community",
    items: [NAV_UTILITY[0], NAV_UTILITY[1], NAV_UTILITY[2], NAV_UTILITY[7]],
  },
];

/** Every destination reachable from the chrome, de-duplicated. */
export const NAV_ALL: readonly NavChild[] = [
  ...NAV_PRIMARY.flatMap((item) => [
    { label: item.label, href: item.href },
    ...(item.children ?? []),
  ]),
  ...NAV_UTILITY,
];

/** Routes that exist as pages but are not part of the public information flow. */
export const NAV_INTERNAL: readonly { label: string; href: string; note: string }[] = [
  {
    label: "Widgets",
    href: ROUTES.widgets,
    note: "The standalone versions of the home page's live panels.",
  },
  {
    label: "Credits",
    href: ROUTES.credits,
    note: "Every photograph on the site, with its licence and author.",
  },
];