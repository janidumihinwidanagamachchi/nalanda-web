export interface MediaSlot {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  placeholder: boolean;
}

const seeded = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const HERO_MEDIA: MediaSlot = {
  id: "hero-campus",
  src: seeded("nalanda-college-colombo-campus", 1600, 1100),
  alt: "Placeholder: the main building of Nalanda College, Siri Dhamma Mawatha, Colombo 10",
  width: 1600,
  height: 1100,
  credit: "Placeholder. Requires a photograph of the main building.",
  placeholder: true,
};

export const GALLERY_SLOTS: MediaSlot[] = [
  { id: "archival-1925", src: seeded("nalanda-1925-original-classrooms", 1200, 900), alt: "Placeholder: the original sixteen classrooms built in 1924", width: 1200, height: 900, credit: "Placeholder. Requires an archival photograph.", placeholder: true },
  { id: "malalasekara-hall", src: seeded("nalanda-malalasekara-hall", 1200, 900), alt: "Placeholder: Malalasekara Hall, the college assembly hall", width: 1200, height: 900, credit: "Placeholder. Requires a photograph.", placeholder: true },
  { id: "centenary-project", src: seeded("nalanda-centenary-innovation-centre", 1200, 900), alt: "Placeholder: rendering of the Innovation Center", width: 1200, height: 900, credit: "Placeholder. A 3D design of the centenary works has been published by the project.", placeholder: true },
  { id: "sports-arena", src: seeded("nalanda-centenary-sports-arena", 1200, 900), alt: "Placeholder: rendering of the Sports Arena", width: 1200, height: 900, credit: "Placeholder. Requires a published design or photograph.", placeholder: true },
  { id: "swimming-pool", src: seeded("nalanda-swimming-pool", 1200, 900), alt: "Placeholder: the college swimming pool", width: 1200, height: 900, credit: "Placeholder. Requires a photograph.", placeholder: true },
  { id: "cadet-band", src: seeded("nalanda-western-cadet-band", 1200, 900), alt: "Placeholder: the Western Cadet Band in formation", width: 1200, height: 900, credit: "Placeholder. Requires a photograph.", placeholder: true },
  { id: "astronomy-night", src: seeded("nalanda-astronomical-society-night-camp", 1200, 900), alt: "Placeholder: a night camp run with the Astronomical Society", width: 1200, height: 900, credit: "Placeholder. Requires a photograph.", placeholder: true },
  { id: "big-match", src: seeded("battle-of-the-maroons-cricket", 1200, 900), alt: "Placeholder: the Battle of the Maroons", width: 1200, height: 900, credit: "Placeholder. Requires a photograph.", placeholder: true },
  { id: "hostel-library", src: seeded("nalanda-hostel-library", 1200, 900), alt: "Placeholder: the hostel library opened in September 2026", width: 1200, height: 900, credit: "Placeholder. Requires a photograph.", placeholder: true },
];

export const CAMPUS_SLOTS: MediaSlot[] = [
  { id: "campus-pavilion", src: seeded("nalanda-college-pavilion", 1400, 1000), alt: "Placeholder: the college pavilion", width: 1400, height: 1000, credit: "Placeholder. Requires a photograph.", placeholder: true },
  { id: "campus-languages", src: seeded("nalanda-language-laboratory", 1400, 1000), alt: "Placeholder: the language laboratory", width: 1400, height: 1000, credit: "Placeholder. Requires a photograph.", placeholder: true },
  { id: "campus-computer-lab", src: seeded("nalanda-computer-laboratory", 1400, 1000), alt: "Placeholder: the computer laboratories", width: 1400, height: 1000, credit: "Placeholder. Requires a photograph.", placeholder: true },
  { id: "campus-hostel", src: seeded("nalanda-college-hostel", 1400, 1000), alt: "Placeholder: the college hostel", width: 1400, height: 1000, credit: "Placeholder. Requires a photograph.", placeholder: true },
];

export const NEWS_THUMB_SEEDS: Record<string, string> = {
  "national-cadet-band-championship": "nalanda-western-cadet-band-championship",
  "first-carbon-footprint-neutral-school": "nalanda-carbon-neutral-campus",
  "hostel-library-opening": "nalanda-hostel-library-opening",
  "centennial-swimming-fiesta": "nalanda-swimming-fiesta",
  "ranaviru-upahara-2026": "ranaviru-upahara",
  "sports-icon-of-the-century": "nalanda-sports-icon",
  "societies-audited-accounts": "nalanda-audited-accounts",
};

export const imageHandoverNote =
  "Every image in this build is a placeholder. A school site is carried by its photography. Replace each slot listed in src/data/media.ts before this goes live.";

export const thumbFor = (slug: string) =>
  seeded(NEWS_THUMB_SEEDS[slug] ?? `nalanda-${slug}`, 1200, 800);