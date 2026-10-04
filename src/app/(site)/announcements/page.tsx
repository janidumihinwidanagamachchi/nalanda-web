import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { ListSkeleton } from "@/components/ui/skeleton";
import { AnnouncementsBoard } from "@/components/announcements/board";
import { getAnnouncements } from "@/lib/content";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Announcements",
  description: `Operational notices and deadlines published by ${SITE.name}, Colombo.`,
};

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <>
      <PageHeader
        eyebrow="Announcements"
        title="Current notices"
        lede="Operational notices with deadlines. Entries close automatically once their expiry date has passed, and anything urgent is pinned to the top."
      />

      <Section className="pt-0">
        <Suspense fallback={<ListSkeleton rows={5} />}>
          <AnnouncementsBoard announcements={announcements} />
        </Suspense>
      </Section>

      <Section>
        <Note className="max-w-3xl">
          Notices are published by the college and are the authoritative source for
          deadlines. Paper circulars remain the legal record; this page mirrors them.
        </Note>

        <p className="measure mt-8 text-sm text-quiet-ink">
          For anything not listed here, the office is the fastest route on{" "}
          <a
            href={`tel:${SITE.contact.phone}`}
            className="wipe text-brand"
          >
            {SITE.contact.phoneDisplay}
          </a>
          , or write to{" "}
          <Link href={ROUTES.contact} className="wipe text-brand">
            the contact page
          </Link>
          .
        </p>
      </Section>
    </>
  );
}