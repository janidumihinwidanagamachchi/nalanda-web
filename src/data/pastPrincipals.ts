export interface Principal {
  name: string;
  tenure: string;
  from: number;
  to: number;
  summary: string;
  achievements: string[];
  legacy: string[];
}

export const PAST_PRINCIPALS: Principal[] = [
  {
    name: "Mr. Ranjith Jayasundara",
    tenure: "2010 to 2017",
    from: 2010,
    to: 2017,
    summary:
      "Assumed duties as principal in 2010 and geared the school towards international activity and competition.",
    achievements: [
      "Students emerged as champions at world class academic competitions",
      "The college was represented at world sports championships",
      "Initiated the Award ceremony for International Achievements",
    ],
    legacy: [
      "After 34 years, Nalanda gained joint championship at the Hermann Loos Challenge Trophy in 2016",
    ],
  },
  {
    name: "Mr. H. U. Premathilka",
    tenure: "1999 to 2010",
    from: 1999,
    to: 2010,
    summary:
      "Appointed principal in 1999. His leadership is recorded as a golden era at Nalanda.",
    achievements: [
      "Island first places in Advanced Level science and commerce streams",
      "Island first places at Ordinary level examinations",
      "Sports and extra-curricular activities reached national and international level competitions",
    ],
    legacy: [
      "Swimming pool added to the campus",
      "Indoor badminton courts added",
      "Squash courts added",
      "New pavilion added",
      "New computer labs initiated and existing ICT facilities expanded",
    ],
  },
  {
    name: "Mr. Edward Ranasinghe",
    tenure: "1994 to 1999",
    from: 1994,
    to: 1999,
    summary:
      "Appointed principal in 1994, at a time when the importance of English education was being emphasised in various forums.",
    achievements: [
      "Launched a project to promote the use of English among students",
      "Established an English debating team",
    ],
    legacy: [
      "Playground upgraded with funding from the Ministry of Sports and the Old Boys' Association",
    ],
  },
  {
    name: "Mr. D. G. Sumanasekara",
    tenure: "1990 to 1994",
    from: 1990,
    to: 1994,
    summary:
      "Succeeded Mr. Dharama Gunasinghe, having previously been principal of Mahanama Vidyalaya, Colombo.",
    achievements: [
      "Improved curricular and extra-curricular performance",
      "Discipline, punctuality and attire became key issues of day-to-day life at Nalanda",
    ],
    legacy: [
      "Foundation stone laid for a new three-storey building comprising eleven classrooms",
      "Construction work of the new language laboratory",
    ],
  },
  {
    name: "Mr. Dharama Gunasinghe",
    tenure: "1982 to 1990",
    from: 1982,
    to: 1990,
    summary:
      "Joined the Nalanda staff as a science teacher, was later promoted to sectional head of the primary section, and became principal in 1982.",
    achievements: [
      "Kept the college maintained to a high standard",
      "Furnished the Malalasekara Hall",
    ],
    legacy: [
      "Malalasekara Hall declared open on 23 June 1990 by the Minister of Education and Higher Education, Mr. Lalith Athulathmudhali, with the Hon. Speaker Mr. M. H. M. Mohamad in attendance",
    ],
  },
  {
    name: "Mr. Sugunadhasa Athukorala",
    tenure: "1969 to 1982",
    from: 1969,
    to: 1982,
    summary:
      "Assumed duties as principal in 1969. Under his guidance Nalanda enjoyed one of its distinguished eras.",
    achievements: [
      "A wave of success in academic and sporting spheres",
      "Foreign languages Russian and French were taught",
      "Student exchange programme launched with Canada",
    ],
    legacy: [
      "Laboratories, classrooms, libraries, a hostel and the Malalasekara Hall added to the campus",
      "Students and teachers fluent in Russian travelled to the Soviet Union for the annual Arctic Holiday Camp on several occasions",
    ],
  },
];

export const PRINCIPALS_NOTE =
  "The college publishes principals from 1969 onward. The period from registration in 1925 to 1969 is not covered by the published list and is left blank rather than reconstructed.";

export interface DownloadItem {
  label: string;
  category: "Examinations" | "Circulars" | "Governance" | "Centenary";
  detail: string;
  format: string;
  href?: string;
}

export const DOWNLOADS: DownloadItem[] = [
  {
    label: "Unit test papers",
    category: "Examinations",
    detail:
      "Published by the college for each subject series. Confirm the current series with your subject teacher.",
    format: "PDF",
  },
  {
    label: "Ministry Circular 25/2026, Grade 1 admissions 2027",
    category: "Circulars",
    detail:
      "Eligibility, age rule, seat allocation categories and the full admission timeline for Grade 1 entry.",
    format: "Circular",
  },
  {
    label: "Ministry Circular 09/2026, admissions to Grades 2 to 11",
    category: "Circulars",
    detail:
      "Class capacities, vacancy basis and the admission window for intermediate and upper grades.",
    format: "Circular",
  },
  {
    label: "Audited financial statement, Society",
    category: "Governance",
    detail:
      "Audited accounts for the period 1 January to 31 December 2025, available for inspection.",
    format: "PDF",
  },
  {
    label: "E-newspaper archive",
    category: "Governance",
    detail:
      "The college newsletter, published online and covering school events across each term.",
    format: "Archive",
  },
  {
    label: "Centenary Project overview",
    category: "Centenary",
    detail:
      "Brochure, building plan, bill of quantities and schedule for the Innovation Center and Sports Arena.",
    format: "Documents",
  },
  {
    label: "Schedule a tour of the centenary works",
    category: "Centenary",
    detail:
      "Tours of the Innovation Center and Sports Arena can be arranged through the Centenary Project.",
    format: "Booking",
  },
];

export const CALENDAR_EVENTS = [
  { date: "2026-07-30", label: "Grade 1 applications close", kind: "Admissions" },
  { date: "2026-09-10", label: "Centennial Swimming Fiesta", kind: "Sport" },
  { date: "2026-10-01", label: "National Cadet Band Championship", kind: "Achievement" },
  { date: "2026-10-15", label: "Grade 1 provisional list published", kind: "Admissions" },
  { date: "2026-10-31", label: "Grade 1 appeals close", kind: "Admissions" },
  { date: "2026-12-20", label: "Grade 1 final list published", kind: "Admissions" },
] as const;

export const CALENDAR_NOTE =
  "Term dates, examination periods and the annual Big Match date are set by the Ministry of Education and the college each year. They are not listed here until confirmed for the current academic year.";