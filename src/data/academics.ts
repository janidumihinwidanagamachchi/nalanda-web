export const ACADEMICS = {
  system: "National education system of Sri Lanka",
  gradeRange: "Grades 1 to 13",
  structure: [
    {
      band: "Junior",
      grades: "Grades 1 to 5",
      enrolment: 984,
      note: "Primary and junior secondary years, housed alongside the senior section on the same campus.",
    },
    {
      band: "Senior",
      grades: "Grades 6 to 11",
      enrolment: 2196,
      note: "Secondary years through to the Ordinary Level examination.",
    },
    {
      band: "Upper",
      grades: "Grades 12 to 13",
      enrolment: "Not separately published in the figures available",
      note: "Advanced Level years. Subject combinations offered are not published.",
    },
  ],
  languages: [
    { name: "Sinhala", medium: "Primary medium of instruction" },
    { name: "Tamil", medium: "Medium of instruction" },
    { name: "English", medium: "Language of study; no direct admission at entry stage" },
  ],
  facilities: [
    { name: "Laboratories", note: "Three laboratories were built with the original 1924 classrooms; further laboratories were added during 1969 to 1982." },
    { name: "Language Laboratory", note: "Construction begun under Mr. D. G. Sumanasekara, 1990 to 1994." },
    { name: "Computer Laboratories", note: "Initiated and expanded under Mr. H. U. Premathilka, 1999 to 2010." },
    { name: "Library", note: "Libraries were added during 1969 to 1982. A dedicated hostel library opened in September 2026." },
    { name: "Swimming Pool", note: "Added under Mr. H. U. Premathilka." },
    { name: "Sports Courts", note: "Indoor badminton courts and squash courts added under Mr. H. U. Premathilka." },
    { name: "Pavilion", note: "Added under Mr. H. U. Premathilka." },
    { name: "Innovation Center", note: "STEAM education platform under construction as part of the Centenary Project." },
  ],
  record: [
    {
      scope: "Advanced Level",
      detail:
        "Island first places in the science and commerce streams were recorded under Mr. H. U. Premathilka.",
    },
    {
      scope: "Ordinary Level",
      detail: "Island first places were recorded under Mr. H. U. Premathilka.",
    },
    {
      scope: "International",
      detail:
        "After 34 years, Nalanda gained joint championship at the Hermann Loos Challenge Trophy in 2016, under Mr. Ranjith Jayasundara.",
    },
    {
      scope: "Academic competitions",
      detail:
        "Students emerged as champions at world class academic competitions during the 2010 to 2017 tenure.",
    },
  ],
  awaitingContent: [
    "Subject combinations offered in Grades 11 to 13, by stream",
    "O/L and A/L results by year, for the current decade",
    "Class sizes by grade for the current year",
    "Terms and examination schedules",
    "Counselling and welfare provision",
  ],
} as const;