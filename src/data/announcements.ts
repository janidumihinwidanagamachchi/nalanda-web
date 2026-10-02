export type AnnouncementCategory =
  | "Admissions"
  | "Examinations"
  | "Circulars"
  | "Events"
  | "General";

export type Severity = "info" | "important" | "urgent";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  publishedAt: string;
  expiresAt?: string;
  pinned?: boolean;
  severity: Severity;
  attachments?: { label: string; href: string }[];
}

export const ANNOUNCEMENT_CATEGORIES: AnnouncementCategory[] = [
  "Admissions",
  "Examinations",
  "Circulars",
  "Events",
  "General",
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "g1-2027-applications",
    title: "Grade 1 admissions for 2027 now open",
    body:
      "Applications for admission to Grade 1 in the 2027 academic year are now open under Ministry Circular No. 25/2026. Children must complete five years of age by 31 January 2027. Applications must be submitted by registered post to at least six schools, including at least three Provincial Council schools near your residence, in order of preference, and must be received on or before 30 July 2026.",
    category: "Admissions",
    publishedAt: "2026-06-30",
    expiresAt: "2026-07-30",
    pinned: true,
    severity: "urgent",
  },
  {
    id: "intermediate-vacancies",
    title: "Vacancies arising at intermediate grades",
    body:
      "Applications are invited for existing vacancies at intermediate grades under Ministry Circular No. 09/2026. Vacancies are calculated as at 31 January 2026, with class capacities of 40 for Grades 2 to 5 and 45 for Grades 6 to 11. All admissions must be completed before 27 April 2026.",
    category: "Admissions",
    publishedAt: "2026-03-31",
    severity: "important",
  },
  {
    id: "g1-provisional-list",
    title: "Grade 1 provisional admission list published",
    body:
      "The provisional admission list for Grade 1 is published on school noticeboards and on the college website. Formal appeals or objections must be lodged by 31 October 2026.",
    category: "Admissions",
    publishedAt: "2026-10-15",
    expiresAt: "2026-10-31",
    severity: "important",
  },
  {
    id: "anti-corruption-admission",
    title: "No payment or donation in connection with admission",
    body:
      "Ministry circulars strictly prohibit donations or payment of any kind in connection with admission to national schools. Any request for such payment should be reported to the school.",
    category: "Circulars",
    publishedAt: "2026-06-25",
    pinned: true,
    severity: "info",
  },
  {
    id: "medium-of-instruction",
    title: "Medium of instruction at entry stage",
    body:
      "Admissions at entry stage are limited to Sinhala and Tamil mediums. There are no direct admissions to the English medium. For schools operating bi-medium curricula, applications may be made under one medium only, and the medium cannot be changed after selection.",
    category: "Admissions",
    publishedAt: "2026-06-25",
    severity: "info",
  },
  {
    id: "unit-test-papers",
    title: "Unit test papers available for download",
    body:
      "Unit test papers are published for download. Candidates should confirm the current paper series with their subject teacher before sitting a test.",
    category: "Examinations",
    publishedAt: "2026-09-01",
    severity: "info",
  },
  {
    id: "audited-accounts",
    title: "Audited financial statement published",
    body:
      "The audited financial statement for the Society for the period 1 January to 31 December 2025 has been published and is available for inspection.",
    category: "General",
    publishedAt: "2026-06-13",
    severity: "info",
  },
  {
    id: "cadet-band-championship",
    title: "National Cadet Band Championship reclaimed",
    body:
      "The Western Cadet Band has secured the All Island Cadet Band Championship, reclaiming the title after 25 years.",
    category: "General",
    publishedAt: "2026-10-01",
    severity: "info",
  },
];

export const isExpired = (a: Announcement, today = new Date()) =>
  Boolean(a.expiresAt && new Date(a.expiresAt) < today);