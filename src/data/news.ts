export type NewsCategory = "Achievements" | "School News";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category: NewsCategory;
  publishedAt: string;
  readMinutes: number;
}

export const NEWS_CATEGORIES: NewsCategory[] = ["Achievements", "School News"];

export const ARTICLES: Article[] = [
  {
    slug: "national-cadet-band-championship",
    title: "Nalanda College Reclaims National Cadet Band Championship After 25 Years",
    excerpt:
      "The Western Cadet Band of Nalanda College has secured the championship at the All Island competition.",
    body: [
      "The Western Cadet Band of Nalanda College has achieved a remarkable milestone, securing the Championship at the All Island Cadet Band Championship.",
      "The title returns to the college after an absence of 25 years, and reflects the sustained work of the band's instructors and the cadets who have drilled through the year.",
      "Cadet banding remains one of the college's most demanding extra-curricular commitments, requiring regular early-morning practice and a high standard of musical discipline.",
    ],
    category: "Achievements",
    publishedAt: "2026-10-01",
    readMinutes: 2,
  },
  {
    slug: "first-carbon-footprint-neutral-school",
    title: "Sri Lanka's First Carbon Footprint Neutral School",
    excerpt:
      "The college is officially recognised as Sri Lanka's first carbon footprint neutral school.",
    body: [
      "Nalanda College has been officially recognised as Sri Lanka's first carbon footprint neutral school, creating another unique record for the institution.",
      "The recognition follows sustained work on the environmental footprint of a campus of more than four thousand students, and places the college among the first schools in the country to reach this standard.",
      "It is a marker of how the second century of the school is being framed: continuity of Buddhist scholarly tradition alongside a contemporary responsibility to the country it serves.",
    ],
    category: "Achievements",
    publishedAt: "2026-06-05",
    readMinutes: 2,
  },
  {
    slug: "hostel-library-opening",
    title: "Hostel Library Opening Ceremony",
    excerpt:
      "The Hostel Library was officially opened, introducing a new space dedicated to learning, reading and academic enrichment.",
    body: [
      "The Hostel Library was officially opened, introducing a new space dedicated to learning, reading and academic enrichment.",
      "The facility gives boarders a dedicated place to study within the hostel, reducing the need to travel to other facilities during study periods.",
      "The newly established space is part of continued investment in boarding life at the college.",
    ],
    category: "School News",
    publishedAt: "2026-09-17",
    readMinutes: 1,
  },
  {
    slug: "centennial-swimming-fiesta",
    title: "Nalanda Centennial Swimming Fiesta",
    excerpt:
      "A celebration of speed, grit and sporting excellence, held on 10 September at the Centennial Swimming Fiesta.",
    body: [
      "The spirit of sporting excellence took centre stage at the Nalanda Centennial Swimming Fiesta, held on 10 September.",
      "The meet formed part of the centenary programme of sporting events, extending a tradition that includes athletics, boxing, aquatics and rugby.",
      "The Old Nalandians' Sports Club, established in 1967, continues to organise major fixtures including the Centennial Rugby Fiesta and the Centennial Boxing Fiesta.",
    ],
    category: "School News",
    publishedAt: "2026-09-11",
    readMinutes: 2,
  },
  {
    slug: "ranaviru-upahara-2026",
    title: "Ranaviru Upahara 2026",
    excerpt:
      "The Nalanda Junior Old Boys' Association presents Ranaviru Upahara 2026, honouring war heroes.",
    body: [
      "The Nalanda Junior Old Boys' Association proudly presents Ranaviru Upahara 2026, a special gathering organised to honour the courage, dedication and sacrifice of the fallen.",
      "The commemoration is held in tribute to Nalandian war heroes who made the supreme sacrifice in defence of the country.",
      "Ranaviru Upahara 2026 was held as a dedicated remembrance, with a further tribute event for the war heroes.",
    ],
    category: "School News",
    publishedAt: "2026-08-06",
    readMinutes: 1,
  },
  {
    slug: "sports-icon-of-the-century",
    title: "Old Nalandians Sports Club - Nalanda Sports Icon of the Century",
    excerpt:
      "The Old Nalandians Sports Club is recognised as Nalanda Sports Icon of the Century.",
    body: [
      "The legendary history of Nalanda College has been written in part by its Old Nalandians, and the Sports Icon of the Century award recognises the club's contribution to that history.",
      "Founded in 1967, the Old Nalandians' Sports Club continues to organise school fixtures and alumni sporting events across rugby, boxing and other codes.",
    ],
    category: "Achievements",
    publishedAt: "2026-06-29",
    readMinutes: 1,
  },
  {
    slug: "societies-audited-accounts",
    title: "Audited Financial Statement for the Society",
    excerpt:
      "The audited financial statement for the period 1 January to 31 December 2025 has been published.",
    body: [
      "The audited financial statement of the Society for the period 1 January to 31 December 2025 has been completed and published.",
      "The statement is available for inspection by interested parties.",
    ],
    category: "School News",
    publishedAt: "2026-06-13",
    readMinutes: 1,
  },
];