export interface Society {
  name: string;
  link?: { label: string; href: string };
  group: "Media and Arts" | "Science and Technology" | "Academic" | "Culture and Service";
}

export const SOCIETIES: Society[] = [
  { name: "Media Unit", link: { label: "NCCU Studios", href: "https://nccustudios.com" }, group: "Media and Arts" },
  { name: "Art Society", link: { label: "Art Society", href: "https://nalandacollegeartsociety.com" }, group: "Media and Arts" },
  { name: "Photography Society", link: { label: "Facebook", href: "https://www.facebook.com/Nalanda.College.Photographic.Art.Society" }, group: "Media and Arts" },
  { name: "Electronic Art Society", link: { label: "Facebook", href: "https://www.facebook.com/ncelectronicarts" }, group: "Media and Arts" },
  { name: "Astronomical Society", link: { label: "Facebook", href: "https://www.facebook.com/ncastronomy" }, group: "Science and Technology" },
  { name: "Aeronautical Society", link: { label: "Facebook", href: "https://www.facebook.com/NalandaWings" }, group: "Science and Technology" },
  { name: "Robotics Society", link: { label: "Facebook", href: "https://www.facebook.com/NalandaWings" }, group: "Science and Technology" },
  { name: "Computer Society", link: { label: "Facebook", href: "https://www.facebook.com/csnclabsofficial" }, group: "Science and Technology" },
  { name: "Technology Association", group: "Science and Technology" },
  { name: "Young Inventors Society", group: "Science and Technology" },
  { name: "Quality Circle", group: "Science and Technology" },
  { name: "Science Society", link: { label: "Facebook", href: "https://www.facebook.com/ncsslk" }, group: "Academic" },
  { name: "Maths Circle", group: "Academic" },
  { name: "Quiz Club", link: { label: "Facebook", href: "https://www.facebook.com/ncquizclub" }, group: "Academic" },
  { name: "Commerce Society", link: { label: "Facebook", href: "https://www.facebook.com/nalandacollegecommercesociety" }, group: "Academic" },
  { name: "Buddhist Association", link: { label: "Facebook", href: "https://www.facebook.com/Nalanda.College.Buddhist.Association" }, group: "Culture and Service" },
  { name: "Saukyadana Unit", link: { label: "Facebook", href: "https://www.facebook.com/nalandasaukyadana" }, group: "Culture and Service" },
];

export const ADDITIONAL_SOCIETY_LINKS: Society[] = [
  { name: "Adventurers' Club", link: { label: "Facebook", href: "https://www.facebook.com/ncacadventurers" }, group: "Culture and Service" },
  { name: "Interact Club", link: { label: "Facebook", href: "https://www.facebook.com/InteractClubofNalandaCollege" }, group: "Culture and Service" },
  { name: "Leo Club", link: { label: "Facebook", href: "https://www.facebook.com/NalandaLeoClub" }, group: "Culture and Service" },
  { name: "Western Music Association", link: { label: "Facebook", href: "https://www.facebook.com/NCWMA" }, group: "Media and Arts" },
];

export interface Sport {
  name: string;
  detail: string;
  link?: { label: string; href: string };
}

export const SPORTS: Sport[] = [
  {
    name: "Cadet Platoon and Band",
    detail:
      "A long-standing tradition at the college. The Western Cadet Band reclaimed the All Island Cadet Band Championship in October 2026 after a 25 year absence.",
    link: { label: "Facebook", href: "https://www.facebook.com/NalandaCadets" },
  },
  {
    name: "Boxing",
    detail:
      "Organised fixtures include the Nalanda Centennial Boxing Fiesta, run with the Old Nalandians' Sports Club.",
    link: { label: "Boxing Club", href: "https://www.facebook.com/ncboxingclub" },
  },
  {
    name: "Aquatic Sports and Life Saving",
    detail:
      "The college added a swimming pool during the tenure of Mr. H. U. Premathilka, and hosted the Centennial Swimming Fiesta on 10 September 2026.",
    link: { label: "Aquatics", href: "https://www.facebook.com/NalandaAquatics" },
  },
  {
    name: "Athletics",
    detail:
      "Track and field representation across inter-school meets, and a foundation of the college's centenary sports programme.",
  },
  {
    name: "Rugby",
    detail:
      "The Nalanda Centennial Rugby Fiesta is organised by the Old Nalandians' Sports Club, with the OBA Melbourne as Tagline Partner.",
  },
  {
    name: "Badminton and Squash",
    detail:
      "Indoor badminton courts and squash courts were added to the campus during the tenure of Mr. H. U. Premathilka.",
  },
  {
    name: "Cricket",
    detail:
      "The Battle of the Maroons is the annual interschool cricket encounter contested in maroon and silver.",
    link: { label: "The Big Match", href: "https://www.battleofthemaroons.lk" },
  },
];

export const EXTRA_CURRICULAR_NOTES = {
  societies:
    "Seventeen societies are listed by the college. Four further society pages circulate on Facebook but are not included in the official list.",
  clubs:
    "The college publishes a clubs page but it is currently empty. No club list is asserted here rather than one being invented.",
  sports:
    "The college publishes a sports page that is currently marked as forthcoming. The sports listed here are drawn from published news, facility records and society pages.",
} as const;