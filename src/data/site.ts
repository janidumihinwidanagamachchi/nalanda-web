export const SITE = {
  name: "Nalanda College",
  shortName: "Nalanda",
  place: "Colombo",
  country: "Sri Lanka",
  tagline: "Wisdom Illuminates Character",
  motto: {
    pali: "Āpadāna Sobhinī Panñā",
    english: "Wisdom Illuminates Character",
    provenance:
      "From the Anguttara Nikāya, Tika Nipāta, Bala Waggo Lakkhana Sutta",
  },
  vision:
    "To gift the world great humans who are endowed with virtues and wisdom.",
  mission:
    "To reward mother Lanka with noble sons with balanced personality, dedicated to serve the country, nation and religion.",
  established: "1 November 1925",
  establishedYear: 1925,
  centenaryYear: 2025,
  type: "Public school",
  affiliation: "Ministry of Education",
  category: "National school",
  gender: "Boys",
  gradeRange: "Grades 1 to 13",
  colours: ["Maroon", "Silver"],
  houses: [
    { name: "Soorya", order: 1 },
    { name: "Chandra", order: 2 },
    { name: "Maurya", order: 3 },
    { name: "Nanda", order: 4 },
  ],
  principal: "Iran Champika",
  alumni: "Old Nalandians",
  address: {
    street: "Siri Dhamma Mawatha",
    locality: "Colombo 10",
    postal: "01000",
    country: "Sri Lanka",
    full: "Siri Dhamma Mawatha, Colombo 10, 01000, Sri Lanka",
    zone: "Colombo Educational Zone",
    division: "Borella Educational Division",
  },
  contact: {
    phone: "+94 11 269 5227",
    phoneDisplay: "011 269 5227",
    email: "info@nalandacollege.lk",
  },
  coordinates: { lat: 6.924041, lng: 79.875182 },
  enrolment: {
    total: 4156,
    junior: 984,
    senior: 2196,
    source:
      "National school census figures for G1-13, all students male",
  },
  social: {
    facebook: "https://www.facebook.com/NalandaCollegeColombo",
    youtube: "https://www.youtube.com/channel/UCCOaxljN65_1vKFuJpmHCsw",
    instagram: "https://www.instagram.com/nccustudios",
    linkedin: "https://www.linkedin.com/company/nalandacollegecolombo",
  },
  website: "https://nalandacollege.lk",
} as const;

export const STATS = [
  { value: 1925, label: "Founded", detail: "1 November, Colombo" },
  { value: 100, label: "Years", detail: "Centenary reached 2025" },
  { value: SITE.enrolment.total, label: "Students", detail: "Grades 1 to 13" },
  { value: 4, label: "Houses", detail: "Soorya, Chandra, Maurya, Nanda" },
] as const;

export const NEEDS_SUPPLY = [
  "School start and finish times (sources conflict: 07:10-13:10 and 07:30-13:30)",
  "Current principal's photograph and official welcome message",
  "Subject streams and combinations offered in Grades 11-13",
  "O/L and A/L examination results by year",
  "Staff directory with roles and departments",
  "Timetable for the current academic year",
  "Uniform and kit specification",
  "Canteen, transport and fee schedules for the current year",
  "School song title and lyrics",
  "Archival photography for the hero, gallery and centenary sections",
] as const;