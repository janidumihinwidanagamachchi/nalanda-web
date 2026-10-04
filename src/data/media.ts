import { ASSET_BASE } from "@/constants/site";

/** Provenance for a photograph the site does not own. */
export interface PhotoSource {
  author: string;
  license: string;
  licenseUrl: string;
  /** Commons (or other) file page where the original and its licence live. */
  page: string;
}

export interface MediaSlot {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  placeholder: boolean;
  /** Ledger plate number, if this slot appears on the home page. */
  plate?: string;
  /** Present on every photograph carrying a third-party licence. */
  source?: PhotoSource;
}

/**
 * Where a slot that is still waiting on a photograph points.
 *
 * These slots used to resolve to seeded `picsum.photos` URLs, so the site
 * rendered photographs of unrelated places and objects underneath captions
 * describing the college's own buildings. A wrong photograph attached to a real
 * claim is worse than an empty frame, because it looks like a record of
 * something that never happened.
 *
 * `MediaFrame` and the gallery now draw an empty slot rather than requesting an
 * image, and this path is only the record of where the file will live once the
 * archive supplies it. Nothing is fetched while `placeholder` is true, so no
 * external host is contacted and `next.config.ts` needs no picsum entry.
 */
const AWAITING = `${ASSET_BASE}/images/awaiting.svg`;

/** A real photograph held in this repository under public/ . */
const local = (file: string) => `${ASSET_BASE}/images/gallery/${file}`;

const CC_BY_SA_40 = "CC BY-SA 4.0";
const BY_SA_URL = "https://creativecommons.org/licenses/by-sa/4.0";
const CC_BY_20 = "CC BY 2.0";
const BY_URL = "https://creativecommons.org/licenses/by/2.0";

export const HERO_MEDIA: MediaSlot = {
  id: "hero-campus",
  src: local("malalasekara-theatre.jpeg"),
  alt: "Interior of the Malalasekara auditorium, where the college assembles",
  width: 2048,
  height: 1152,
  credit:
    "Plate I · Photograph: Kavindu Mahanaam, CC BY-SA 4.0, via Wikimedia Commons.",
  placeholder: false,
  plate: "I",
  source: {
    author: "Kavindu Mahanaam",
    license: CC_BY_SA_40,
    licenseUrl: BY_SA_URL,
    page: "https://commons.wikimedia.org/wiki/File:Malalasekara_Theatre.jpeg",
  },
};

export const GALLERY_SLOTS: MediaSlot[] = [
  { id: "archival-1925", src: AWAITING, alt: "Placeholder: the block of sixteen rooms raised in 1924, twelve of them classrooms", width: 1200, height: 900, credit: "Awaiting photograph — the original sixteen rooms raised in 1924.", placeholder: true },
  {
    id: "malalasekara-hall",
    src: local("malalasekara-theatre.jpeg"),
    alt: "Interior of the Malalasekara auditorium, photographed as it was completed",
    width: 2048,
    height: 1152,
    credit: "Photograph: Kavindu Mahanaam, CC BY-SA 4.0, via Wikimedia Commons.",
    placeholder: false,
    source: {
      author: "Kavindu Mahanaam",
      license: CC_BY_SA_40,
      licenseUrl: BY_SA_URL,
      page: "https://commons.wikimedia.org/wiki/File:Malalasekara_Theatre.jpeg",
    },
  },
  {
    id: "play-ground",
    src: local("play-ground.jpeg"),
    alt: "The college play ground",
    width: 960,
    height: 720,
    credit: "Photograph: Kavindu Mahanaam, CC BY-SA 4.0, via Wikimedia Commons.",
    placeholder: false,
    source: {
      author: "Kavindu Mahanaam",
      license: CC_BY_SA_40,
      licenseUrl: BY_SA_URL,
      page: "https://commons.wikimedia.org/wiki/File:Nalada_College_Play_Ground.jpeg",
    },
  },
  {
    id: "nalanda-tv",
    src: local("nalanda-tv.jpg"),
    alt: "The studio from which Nalanda TV was broadcast by the college Communication Unit in 2019",
    width: 2048,
    height: 1365,
    credit: "Photograph: Sherloque Wells, CC BY-SA 4.0, via Wikimedia Commons.",
    placeholder: false,
    source: {
      author: "Sherloque Wells",
      license: CC_BY_SA_40,
      licenseUrl: BY_SA_URL,
      page: "https://commons.wikimedia.org/wiki/File:Nalanda_TV.jpg",
    },
  },
  {
    id: "science-day",
    src: local("science-day.jpg"),
    alt: "An announcement at a Nalanda College Science Day in the 1980s",
    width: 690,
    height: 478,
    credit: "Photograph: Sherloque Wells, CC BY-SA 4.0, via Wikimedia Commons.",
    placeholder: false,
    source: {
      author: "Sherloque Wells",
      license: CC_BY_SA_40,
      licenseUrl: BY_SA_URL,
      page: "https://commons.wikimedia.org/wiki/File:Nalanda_Science_Day_Announcing.jpg",
    },
  },
  {
    id: "astronomy-night",
    src: local("eclipse-nalanda.jpg"),
    alt: "The total solar eclipse of 26 January 2009, observed from the college grounds by the Astronomical Society",
    width: 1500,
    height: 1125,
    credit: "Photograph: Bruno Sanchez-Andrade Nuño, CC BY 2.0, via Wikimedia Commons.",
    placeholder: false,
    source: {
      author: "Bruno Sanchez-Andrade Nuño",
      license: CC_BY_20,
      licenseUrl: BY_URL,
      page: "https://commons.wikimedia.org/wiki/File:Sri_Lanka%27s_Best_Pictures_From_Eclipse_%40_Nalanda_Grounds_by_NCAS_%283242898237%29.jpg",
    },
  },
  { id: "centenary-project", src: AWAITING, alt: "Placeholder: rendering of the Innovation Center", width: 1200, height: 900, credit: "Awaiting published design or photograph — the Centenary Innovation Center.", placeholder: true },
  { id: "sports-arena", src: AWAITING, alt: "Placeholder: rendering of the Sports Arena", width: 1200, height: 900, credit: "Awaiting published design or photograph — the Centenary Sports Arena.", placeholder: true },
  { id: "swimming-pool", src: AWAITING, alt: "Placeholder: the college swimming pool", width: 1200, height: 900, credit: "Plate IV · Awaiting photograph — the swimming pool.", placeholder: true, plate: "IV" },
  { id: "cadet-band", src: AWAITING, alt: "Placeholder: the Western Cadet Band in formation", width: 1200, height: 900, credit: "Plate V · Awaiting photograph — the Western Cadet Band.", placeholder: true, plate: "V" },
  { id: "big-match", src: AWAITING, alt: "Placeholder: the Battle of the Maroons", width: 1200, height: 900, credit: "Plate VI · Awaiting photograph — the Battle of the Maroons or a major school fixture.", placeholder: true, plate: "VI" },
  { id: "hostel-library", src: AWAITING, alt: "Placeholder: the hostel library opened in September 2026", width: 1200, height: 900, credit: "Plate III · Awaiting photograph — the hostel library.", placeholder: true, plate: "III" },
];

const HOME_PHOTO_IDS = ["astronomy-night", "nalanda-tv", "play-ground"] as const;

/**
 * Photographs surfaced on the home page, drawn from GALLERY_SLOTS rather than
 * redeclared, so one photograph is one record with one attribution wherever it
 * appears. The Malalasekara auditorium is deliberately absent: it is the hero,
 * and repeating it a screen later reads as filler.
 */
export const HOME_PHOTOS: MediaSlot[] = HOME_PHOTO_IDS.flatMap((id) => {
  const slot = GALLERY_SLOTS.find((candidate) => candidate.id === id);
  return slot ? [slot] : [];
});

export const CAMPUS_SLOTS: MediaSlot[] = [
  { id: "campus-pavilion", src: AWAITING, alt: "Placeholder: the college pavilion", width: 1400, height: 1000, credit: "Awaiting photograph — the college pavilion.", placeholder: true },
  { id: "campus-languages", src: AWAITING, alt: "Placeholder: the language laboratory", width: 1400, height: 1000, credit: "Awaiting photograph — the language laboratory.", placeholder: true },
  { id: "campus-computer-lab", src: AWAITING, alt: "Placeholder: the computer laboratories", width: 1400, height: 1000, credit: "Plate II · Awaiting photograph — a science or computer laboratory.", placeholder: true, plate: "II" },
  { id: "campus-hostel", src: AWAITING, alt: "Placeholder: the college hostel", width: 1400, height: 1000, credit: "Awaiting photograph — the college hostel.", placeholder: true },
];

/** Every slot on the site, in the order the credits page lists them. */
export const ALL_MEDIA: MediaSlot[] = [
  HERO_MEDIA,
  ...GALLERY_SLOTS,
  ...CAMPUS_SLOTS,
];

/** Slots holding a photograph the college does not own, needing attribution. */
export const ATTRIBUTED_SLOTS = ALL_MEDIA.filter((slot) => slot.source);

/** Slots still standing in for a photograph the school has not supplied. */
export const AWAITING_SLOTS = ALL_MEDIA.filter((slot) => slot.placeholder);

export const imageHandoverNote =
  "Some frames are still placeholders. The photographs already published come from Wikimedia Commons under free licences and are credited in full on the credits page; the rest stand in for images only the school's own archive can supply — the main building, the 1924 rooms, the swimming pool, the Western Cadet Band, the hostel library and the centenary designs.";

/**
 * A news thumbnail.
 *
 * Every story has a slot here so a card is laid out identically whether or not
 * an editor has uploaded a photograph. Until one exists the slot is a
 * placeholder, and `MediaFrame` draws it as an empty frame rather than fetching
 * a stand-in image — so the news grid never shows a stock photograph that a
 * reader would take for a photograph of the event.
 */
export const thumbFor = (): string => AWAITING;