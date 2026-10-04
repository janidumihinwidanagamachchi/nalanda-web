import { SITE } from "@/data/site";

/**
 * Structured data for the college.
 *
 * A school is one of the few things a search engine can be told about
 * unambiguously: it is an organisation at an address, it teaches a curriculum, it
 * has a founding date and a number of students. All of that is on this site
 * already and none of it was machine-readable, so a Knowledge Panel or a local
 * result had nothing to build from and fell back to guessing.
 *
 * Emitted once from the root layout as `School` (the schema.org profile that
 * Google and Bing both read for educational institutions), plus `Organization`
 * for the social accounts. Article and Event markup is emitted by the news and
 * calendar routes, which own those facts.
 *
 * Every value is read from `SITE` in src/data, so this cannot drift from the
 * copy the rest of the site renders. Nothing is asserted here that is not
 * already published on a page.
 */
export function schoolSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": `${SITE.website}/#school`,
    name: SITE.name,
    alternateName: `${SITE.name}, ${SITE.place}`,
    url: SITE.website,
    description: SITE.vision,
    foundingDate: String(SITE.establishedYear),
    slogan: SITE.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      postalCode: SITE.address.postal,
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.coordinates.lat,
      longitude: SITE.coordinates.lng,
    },
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    servesEducationalLevel: "Primary through secondary (Grades 1 to 13)",
    numberOfStudents: SITE.enrolment.total,
    alumni: SITE.alumni,
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: SITE.affiliation,
    },
    sameAs: [
      SITE.social.facebook,
      SITE.social.youtube,
      SITE.social.instagram,
      SITE.social.linkedin,
    ].filter(Boolean),
  };
}

/** The social profile, which also carries the logo and the contact points. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.website}/#organization`,
    name: SITE.name,
    legalName: SITE.name,
    url: SITE.website,
    logo: `${SITE.website}/nalanda-web/brand/crest.png`,
    image: `${SITE.website}/nalanda-web/brand/crest.png`,
    email: SITE.contact.email,
    telephone: SITE.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      postalCode: SITE.address.postal,
      addressCountry: "LK",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "admissions",
        telephone: SITE.contact.phone,
        email: SITE.contact.email,
        availableLanguage: ["en", "si", "ta"],
      },
    ],
  };
}