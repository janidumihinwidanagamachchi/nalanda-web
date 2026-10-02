export const Z = {
  base: 0,
  raised: 10,
  sticky: 100,
  nav: 200,
  overlay: 300,
  modal: 400,
  grain: 500,
} as const;

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
} as const;

export const NAV_PRIMARY = [
  { label: "About", href: ROUTES.about, children: [
    { label: "About the College", href: ROUTES.about },
    { label: "History", href: ROUTES.history },
    { label: "Past Principals", href: ROUTES.pastPrincipals },
    { label: "Centenary", href: ROUTES.centenary },
  ]},
  { label: "Academics", href: ROUTES.academics },
  { label: "Admissions", href: ROUTES.admissions },
  { label: "Announcements", href: ROUTES.announcements },
  { label: "News", href: ROUTES.news },
  { label: "Extra Curricular", href: ROUTES.extraCurricular, children: [
    { label: "Clubs", href: ROUTES.clubs },
    { label: "Societies", href: ROUTES.societies },
    { label: "Sports", href: ROUTES.sports },
  ]},
] as const;

export const NAV_SECONDARY = [
  { label: "Community", href: ROUTES.community },
  { label: "Channels", href: ROUTES.channels },
  { label: "Alumni", href: ROUTES.alumni },
  { label: "Downloads", href: ROUTES.downloads },
  { label: "Gallery", href: ROUTES.gallery },
  { label: "Calendar", href: ROUTES.calendar },
  { label: "Campus", href: ROUTES.campus },
  { label: "Newsletter", href: ROUTES.newsletter },
  { label: "Contact", href: ROUTES.contact },
] as const;