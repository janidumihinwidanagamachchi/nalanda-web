export interface CommunityBody {
  slug: string;
  name: string;
  kind: string;
  founded: string;
  summary: string;
  website?: string;
  links?: { label: string; href: string; verified?: boolean }[];
}

export const COMMUNITY_BODIES: CommunityBody[] = [
  {
    slug: "oba",
    name: "Nalanda College Old Boys' Association",
    kind: "Alumni association",
    founded: "Established for Old Nalandians",
    summary:
      "The national body of Old Nalandians, maintaining the connection between past pupils and the college and organising major fixtures and occasions.",
    website: "https://www.nalandaoba.lk",
    links: [
      { label: "Official website", href: "https://www.nalandaoba.lk", verified: true },
      { label: "Facebook", href: "https://www.facebook.com/NalandaCollegeOBA" },
    ],
  },
  {
    slug: "njoba",
    name: "Nalanda Junior Old Boys' Association",
    kind: "Junior alumni association",
    founded: "Junior Old Nalandians",
    summary:
      "The junior counterpart to the OBA, organising events including Ranaviru Upahara and representing younger Old Nalandians.",
    website: "https://www.njoba.lk",
    links: [
      { label: "Official website", href: "https://www.njoba.lk", verified: true },
    ],
  },
  {
    slug: "nccu",
    name: "Nalanda College Communication Unit",
    kind: "Media unit",
    founded: "NCCU Studios",
    summary:
      "Produces some of Sri Lanka's most recognised school television and radio broadcasts, organises the All Island Media Day competitions, and distributes across Facebook, Instagram, YouTube, Spotify and Apple Music.",
    website: "https://nccustudios.com",
    links: [
      { label: "NCCU Studios", href: "https://nccustudios.com", verified: true },
      { label: "Facebook", href: "https://www.facebook.com/nccustudios" },
      { label: "Instagram", href: "https://www.instagram.com/nccustudios" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UCCOaxljN65_1vKFuJpmHCsw", verified: true },
    ],
  },
  {
    slug: "big-match",
    name: "Battle of the Maroons",
    kind: "The Big Match",
    founded: "Annual fixture",
    summary:
      "The annual interschool cricket encounter known as the Big Match, contested in maroon and silver.",
    website: "https://www.battleofthemaroons.lk",
    links: [
      { label: "Official website", href: "https://www.battleofthemaroons.lk", verified: true },
      { label: "Facebook", href: "https://www.facebook.com/battleofthemaroons" },
    ],
  },
  {
    slug: "scouts",
    name: "Nalanda College Scout Group",
    kind: "32nd Colombo troop",
    founded: "Established 1967",
    summary:
      "Registered with the Sri Lanka Scouts Association on 18 June 1967 as the 32nd Colombo Nalanda College Scouts Troop, Registration No. A246. The first Group Scout Leader was Mr. Gunapala Wickramaratne, then Principal of the college.",
    links: [
      { label: "Facebook", href: "https://www.facebook.com/nalandascouts" },
    ],
  },
  {
    slug: "onsc",
    name: "Old Nalandians' Sports Club",
    kind: "Sports club",
    founded: "Established 1967",
    summary:
      "Organises school fixtures and alumni sporting events, including the Nalanda Centennial Rugby Fiesta and the Nalanda Centennial Boxing Fiesta.",
    website: "https://www.onsc.lk",
    links: [
      { label: "Official website", href: "https://www.onsc.lk", verified: true },
    ],
  },
  {
    slug: "astronomical-society",
    name: "Nalanda College Alumni Astronomical Society",
    kind: "Alumni scientific society",
    founded: "Established 1995",
    summary:
      "The alumni club of the Nalanda College Astronomical Society, formed in 1995. Together with the student society it has run more than 230 night camps across Sri Lanka, roughly 50 of them on the college premises, and has reached an estimated half a million people through science outreach.",
    links: [
      { label: "YouTube", href: "https://www.youtube.com/@ncastronomy", verified: true },
      { label: "Facebook", href: "https://www.facebook.com/ncastronomy" },
    ],
  },
  {
    slug: "commerce-society",
    name: "Nalanda College Commerce Society",
    kind: "Student society",
    founded: "NCCS",
    summary:
      "The Commerce Society of the college, running events and member activity for students of commerce and accountancy.",
    website: "https://nalandacommerce.lk",
    links: [
      { label: "Official website", href: "https://nalandacommerce.lk", verified: true },
    ],
  },
];

export interface Branch {
  region: string;
  links?: { label: string; href: string }[];
}

export const INTERNATIONAL_BRANCHES: Branch[] = [
  { region: "Qatar", links: [{ label: "Facebook", href: "https://www.facebook.com/nalandaobaqatar" }] },
  { region: "Melbourne", links: [{ label: "Facebook", href: "https://www.facebook.com/NalandaOBAMelbourne" }] },
  { region: "Canada", links: [{ label: "Instagram", href: "https://www.instagram.com/nalandacanada" }] },
  { region: "Australia", links: [{ label: "OBA Melbourne, Tagline Partner, Nalanda Centennial Rugby Fiesta", href: "https://www.facebook.com/NalandaOBAMelbourne" }] },
];