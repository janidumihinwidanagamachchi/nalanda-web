export type TimelineEra = "origins" | "growth" | "centenary";

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  era: TimelineEra;
}

export const TIMELINE: TimelineEntry[] = [
  {
    year: "1922",
    title: "A section moves from Ananda",
    body:
      "Following a proposal by Patrick de Silva Kularatne, a section of Ananda College is relocated to Campbell Place, Colombo. L. H. Mettananda is appointed principal of the new institution, known as the Ananda branch.",
    era: "origins",
  },
  {
    year: "1922",
    title: "Foundation stone laid",
    body:
      "In the same year Sir Gregory Thompson, Governor of Ceylon, lays the foundation stone for the new school.",
    era: "origins",
  },
  {
    year: "1924",
    title: "Land is bought and rooms raised",
    body:
      "After leasing an acre beside the Campbell Place playground, where junior classes first sat in mud huts, Kularatne buys four adjoining acres for Rs 55,000 and raises a block of sixteen rooms. Two become laboratories and two more the staff room and the principal's office, leaving twelve as classrooms.",
    era: "origins",
  },
  {
    year: "1924",
    title: "330 students transfer",
    body:
      "A total of 330 students move across from Ananda College under the care of the principal.",
    era: "origins",
  },
  {
    year: "1925",
    title: "Registered as a separate school",
    body:
      "On 1 November the institution is registered as an independent school, an offshoot of Ananda College founded by the Buddhist educator Patrick de Silva Kularatne.",
    era: "origins",
  },
  {
    year: "1925",
    title: "The name and the motto",
    body:
      "The name Nalanda is proposed by Ananda Maitreya Thero. The motto is drawn from the Anguttara Nikāya, Tika Nipāta, Bala Waggo Lakkhana Sutta.",
    era: "origins",
  },
  {
    year: "1925",
    title: "First principal",
    body:
      "Piyasena Malalasekara becomes the first registered principal of the newly formed Nalanda College, and the principal of the Ananda branch returns to Ananda College as vice principal.",
    era: "origins",
  },
  {
    year: "1926",
    title: "Second building",
    body:
      "The foundation stone for a second building is laid on 30 March 1926. By the end of the year enrolment has risen to 550. The assembly hall is later named the Malalasekara Theatre in honour of the first principal.",
    era: "growth",
  },
  {
    year: "1927",
    title: "Gandhi addresses the students",
    body:
      "Mahatma Gandhi speaks at Nalanda Vidyalaya on 15 November, during his 1927 tour of Ceylon. He tells the students that unless they carried the teaching of the Buddha into their own lives, their having belonged to the institution would be of no use.",
    era: "growth",
  },
  {
    year: "2025",
    title: "One hundred years",
    body:
      "The college marks a century since registration, celebrating a hundred years of scholarship, discipline and service. The Centenary Project is already underway for the Innovation Center and Sports Arena.",
    era: "centenary",
  },
  {
    year: "2026",
    title: "First carbon footprint neutral school in Sri Lanka",
    body:
      "The college is officially recognised as Sri Lanka's first carbon footprint neutral school.",
    era: "centenary",
  },
  {
    year: "2026",
    title: "National Cadet Band Championship",
    body:
      "The Western Cadet Band secures the All Island Cadet Band Championship, reclaiming the title after 25 years.",
    era: "centenary",
  },
  {
    year: "2026",
    title: "Hostel Library opens",
    body:
      "A new library space is opened in the hostel, dedicated to reading and academic enrichment.",
    era: "centenary",
  },
  {
    year: "2026",
    title: "Centennial Swimming Fiesta",
    body:
      "The Nalanda Centennial Swimming Fiesta is held on 10 September, celebrating a century of sporting excellence.",
    era: "centenary",
  },
];

export const CENTENARY_PROJECT = {
  name: "Nalanda Centenary Project",
  site: "https://nalanda100.lk",
  email: "donatios@nalanda100.lk",
  summary:
    "A national initiative aligned with the college's hundredth anniversary, comprising a state-of-the-art Innovation Center and Sports Arena intended to serve the nation.",
  facilities: [
    {
      name: "Innovation Center",
      detail:
        "A STEAM education platform established through a Memorandum of Understanding signed with STEMUP in March 2025.",
    },
    {
      name: "Sports Arena",
      detail:
        "A modern sports complex intended to carry the college's sporting tradition into its second century.",
    },
  ],
  milestones: [
    {
      date: "2024-10-20",
      label: "Foundation stone laid",
      detail:
        "The Centenary Project begins, with the Innovation Center and Sports Arena announced as underway.",
    },
    {
      date: "2025-01-25",
      label: "Design revealed",
      detail:
        "3D designs for the Innovation Center and Sports Arena are released to Old Nalandians.",
    },
    {
      date: "2025-03-20",
      label: "STEMUP partnership",
      detail:
        "The Centenary Project and STEMUP sign a Memorandum of Understanding to establish a STEAM education platform at the college.",
    },
  ],
} as const;