export type ChannelTier = "A" | "B";
export type ChannelPlatform =
  | "Website"
  | "Facebook"
  | "Instagram"
  | "YouTube"
  | "LinkedIn"
  | "Music";

export interface Channel {
  id: string;
  label: string;
  entity: string;
  platform: ChannelPlatform;
  href: string;
  tier: ChannelTier;
  note?: string;
}

const verified = undefined;

export const CHANNELS: Channel[] = [
  {
    id: "college-site",
    label: "nalandacollege.lk",
    entity: "Nalanda College",
    platform: "Website",
    href: "https://nalandacollege.lk",
    tier: "A",
    note: verified,
  },
  {
    id: "college-fb",
    label: "NalandaCollegeColombo",
    entity: "Nalanda College",
    platform: "Facebook",
    href: "https://www.facebook.com/NalandaCollegeColombo",
    tier: "B",
    note: "Facebook cannot be machine-verified; it returns HTTP 200 for pages that do not exist.",
  },
  {
    id: "college-yt",
    label: "Nalanda College",
    entity: "Nalanda College",
    platform: "YouTube",
    href: "https://www.youtube.com/channel/UCCOaxljN65_1vKFuJpmHCsw",
    tier: "A",
    note: "Linked from the official site footer. Public RSS shows no upload since 2021.",
  },
  {
    id: "college-li",
    label: "Nalanda College Colombo",
    entity: "Nalanda College",
    platform: "LinkedIn",
    href: "https://www.linkedin.com/company/nalandacollegecolombo",
    tier: "B",
    note: "Company page. Replaces a /school/ path that could not be reached.",
  },
  {
    id: "oba-site",
    label: "nalandaoba.lk",
    entity: "Old Boys' Association",
    platform: "Website",
    href: "https://www.nalandaoba.lk",
    tier: "A",
  },
  {
    id: "oba-fb",
    label: "NalandaCollegeOBA",
    entity: "Old Boys' Association",
    platform: "Facebook",
    href: "https://www.facebook.com/NalandaCollegeOBA",
    tier: "B",
  },
  {
    id: "njoba-site",
    label: "njoba.lk",
    entity: "Junior Old Boys' Association",
    platform: "Website",
    href: "https://www.njoba.lk",
    tier: "A",
  },
  {
    id: "nccu-site",
    label: "nccustudios.com",
    entity: "Communication Unit",
    platform: "Website",
    href: "https://nccustudios.com",
    tier: "A",
  },
  {
    id: "nccu-fb",
    label: "nccustudios",
    entity: "Communication Unit",
    platform: "Facebook",
    href: "https://www.facebook.com/nccustudios",
    tier: "B",
  },
  {
    id: "nccu-ig",
    label: "nccustudios",
    entity: "Communication Unit",
    platform: "Instagram",
    href: "https://www.instagram.com/nccustudios",
    tier: "B",
  },
  {
    id: "nccu-yt",
    label: "Nalanda College",
    entity: "Communication Unit",
    platform: "YouTube",
    href: "https://www.youtube.com/channel/UCCOaxljN65_1vKFuJpmHCsw",
    tier: "A",
  },
  {
    id: "bigmatch-site",
    label: "battleofthemaroons.lk",
    entity: "Battle of the Maroons",
    platform: "Website",
    href: "https://www.battleofthemaroons.lk",
    tier: "A",
  },
  {
    id: "bigmatch-fb",
    label: "battleofthemaroons",
    entity: "Battle of the Maroons",
    platform: "Facebook",
    href: "https://www.facebook.com/battleofthemaroons",
    tier: "B",
  },
  {
    id: "scouts-fb",
    label: "nalandascouts",
    entity: "Scout Group",
    platform: "Facebook",
    href: "https://www.facebook.com/nalandascouts",
    tier: "B",
    note: "The former website ncst.nalandacollege.lk no longer resolves in DNS.",
  },
  {
    id: "astronomy-yt",
    label: "@ncastronomy",
    entity: "Astronomical Society",
    platform: "YouTube",
    href: "https://www.youtube.com/@ncastronomy",
    tier: "A",
  },
  {
    id: "astronomy-fb",
    label: "ncastronomy",
    entity: "Astronomical Society",
    platform: "Facebook",
    href: "https://www.facebook.com/ncastronomy",
    tier: "B",
  },
  {
    id: "science-fb",
    label: "ncsslk",
    entity: "Science Society",
    platform: "Facebook",
    href: "https://www.facebook.com/ncsslk",
    tier: "B",
  },
  {
    id: "photographic-fb",
    label: "Nalanda College Photographic Art Society",
    entity: "Photographic Art Society",
    platform: "Facebook",
    href: "https://www.facebook.com/Nalanda.College.Photographic.Art.Society",
    tier: "B",
  },
  {
    id: "adventurers-fb",
    label: "ncacadventurers",
    entity: "Adventurers' Club",
    platform: "Facebook",
    href: "https://www.facebook.com/ncacadventurers",
    tier: "B",
  },
  {
    id: "interact-fb",
    label: "Interact Club of Nalanda College",
    entity: "Interact Club",
    platform: "Facebook",
    href: "https://www.facebook.com/InteractClubofNalandaCollege",
    tier: "B",
  },
  {
    id: "leo-fb",
    label: "NalandaLeoClub",
    entity: "Leo Club",
    platform: "Facebook",
    href: "https://www.facebook.com/NalandaLeoClub",
    tier: "B",
  },
  {
    id: "buddhist-fb",
    label: "NalandaBuddhistAssociation",
    entity: "Buddhist Association",
    platform: "Facebook",
    href: "https://www.facebook.com/NalandaBuddhistAssociation",
    tier: "B",
  },
  {
    id: "western-music-fb",
    label: "NCWMA",
    entity: "Western Music Association",
    platform: "Facebook",
    href: "https://www.facebook.com/NCWMA",
    tier: "B",
  },
  {
    id: "boxing-fb",
    label: "ncboxingclub",
    entity: "Boxing Club",
    platform: "Facebook",
    href: "https://www.facebook.com/ncboxingclub",
    tier: "B",
  },
  {
    id: "aquatics-fb",
    label: "NalandaAquatics",
    entity: "Aquatic Sports & Life Saving Club",
    platform: "Facebook",
    href: "https://www.facebook.com/NalandaAquatics",
    tier: "B",
  },
  {
    id: "cadets-fb",
    label: "NalandaCadets",
    entity: "Cadet Platoon & Band",
    platform: "Facebook",
    href: "https://www.facebook.com/NalandaCadets",
    tier: "B",
  },
  {
    id: "centenary-site",
    label: "nalanda100.lk",
    entity: "Centenary Project",
    platform: "Website",
    href: "https://nalanda100.lk",
    tier: "A",
  },
  {
    id: "centenary-fb",
    label: "nalandacentenaryproject",
    entity: "Centenary Project",
    platform: "Facebook",
    href: "https://www.facebook.com/nalandacentenaryproject",
    tier: "B",
    note: "Independent sources point to this page rather than a Nalanda100 handle.",
  },
  {
    id: "onsc-site",
    label: "onsc.lk",
    entity: "Old Nalandians' Sports Club",
    platform: "Website",
    href: "https://www.onsc.lk",
    tier: "A",
  },
  {
    id: "commerce-site",
    label: "nalandacommerce.lk",
    entity: "Commerce Society",
    platform: "Website",
    href: "https://nalandacommerce.lk",
    tier: "A",
  },
  {
    id: "oba-qatar",
    label: "nalandaobaqatar",
    entity: "OBA Qatar",
    platform: "Facebook",
    href: "https://www.facebook.com/nalandaobaqatar",
    tier: "B",
  },
  {
    id: "oba-melbourne",
    label: "NalandaOBAMelbourne",
    entity: "OBA Melbourne",
    platform: "Facebook",
    href: "https://www.facebook.com/NalandaOBAMelbourne",
    tier: "B",
  },
  {
    id: "oba-canada-ig",
    label: "nalandacanada",
    entity: "OBA Canada",
    platform: "Instagram",
    href: "https://www.instagram.com/nalandacanada",
    tier: "B",
  },
];

export const YOUTUBE_CHANNEL_ID = "UCCOaxljN65_1vKFuJpmHCsw";

export const PLATFORM_ORDER: ChannelPlatform[] = [
  "Website",
  "Facebook",
  "Instagram",
  "YouTube",
  "LinkedIn",
  "Music",
];

export const VERIFICATION_NOTE =
  "Tier A links were checked directly over HTTP. Facebook and Instagram return success responses for pages and handles that do not exist, so they cannot be machine-verified and are marked Tier B. Tier B links are included as supplied and should be confirmed by hand.";