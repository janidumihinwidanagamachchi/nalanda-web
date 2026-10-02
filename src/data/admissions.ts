export type SeatCategory = {
  label: string;
  share: number;
};

export const SEAT_ALLOCATION: SeatCategory[] = [
  { label: "Close proximity residents", share: 50 },
  { label: "Past pupils' children", share: 25 },
  { label: "Siblings already in school", share: 14 },
  { label: "Children of education staff", share: 6 },
  { label: "Children of transferred officers", share: 4 },
  { label: "Overseas returnees", share: 1 },
];

export const GRADE_ONE = {
  circular: "Circular No. 25/2026",
  year: "2027",
  issuedBy: "Ministry of Education, Higher Education and Vocational Training",
  ageRule: "Child must complete five years of age by 31 January 2027",
  ageHardStop:
    "Children aged six or above are accommodated only after all qualified children under six have been placed, subject to vacancy availability",
  documents: [
    "Valid birth certificate (mandatory)",
    "If a birth certificate is unavailable, a temporary age certificate issued by the Registrar General or an authorised district or additional district registrar",
  ],
  method: [
    "Apply by registered post only, using the specimen form",
    "Apply to at least six schools, including at least three Provincial Council schools near your residence",
    "List schools in clear order of preference",
    "Hand delivery is permitted only where a school receives fewer applications than its vacant capacity",
  ],
  mediumRule:
    "Admissions at entry stage are limited to Sinhala and Tamil mediums. There are no direct admissions to the English medium.",
  mediumLock:
    "For schools operating bi-medium curricula, parents may apply under one medium only. Changing the medium of instruction after selection is not permitted.",
  integrity:
    "Circulars strictly prohibit donations or payment of any kind in connection with admission.",
  timeline: [
    { date: "2026-06-30", label: "Documents valid to", detail: "Cut-off for residence and qualification documents" },
    { date: "2026-07-30", label: "Applications close", detail: "Received by registered post on or before this date" },
    { date: "2026-10-15", label: "Provisional list published", detail: "Provisional selection and waiting lists published on school noticeboards and websites" },
    { date: "2026-10-31", label: "Appeals close", detail: "Final date to lodge formal appeals or objections" },
    { date: "2026-12-20", label: "Final list published", detail: "Finalised selection list released" },
  ],
  unsuccessful:
    "A child who secures admission at none of the applied schools may appeal to the Zonal Education Director within one month. The Zonal Director is required to provide an alternative school with vacant seats in the area.",
} as const;

export const INTERMEDIATE_AND_OTHER = {
  circular: "Circular No. 09/2026",
  issuedOn: "2026-03-31",
  scope: "Admissions to Grades 2 to 11, excluding Grades 5 and 6",
  vacancyBasis: "Vacancies calculated as at 31 January 2026",
  capacities: [
    { grades: "Grades 2 to 5", max: 40 },
    { grades: "Grades 6 to 11", max: 45 },
  ],
  eligibility: [
    "Government transfers",
    "Returnees from abroad",
    "Change of residence",
    "Scholarship students",
    "Children of education staff",
  ],
  timeline: [
    { date: "2026-01-31", label: "Vacancy calculation closes", detail: "Class strength assessed for the year" },
    { date: "2026-02-15", label: "Publication", detail: "Vacancy lists published" },
    { date: "2026-02-16", label: "Applications open", detail: "Applications accepted to 28 February" },
    { date: "2026-03-01", label: "Interviews", detail: "Interviews held 1 to 15 March" },
    { date: "2026-03-31", label: "Approvals conclude", detail: "Approvals given before this date" },
    { date: "2026-04-27", label: "Admissions complete", detail: "All admissions must be completed before this date" },
  ],
} as const;

export const ADMISSIONS_NOTES = {
  intakes: "Entry to Grade 1, and vacancies arising in intermediate grades.",
  applicationLanguage:
    "Applications are published by the school, including in Sinhala. English translations are provided here for reference.",
  enquiry: "Enquiries about vacancies and application forms are directed to the school office.",
} as const;