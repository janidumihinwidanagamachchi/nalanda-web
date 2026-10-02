import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { ListSkeleton } from "@/components/ui/skeleton";
import { AnnouncementsBoard } from "@/components/announcements/board";
import { SITE } from "@/data/site";
import { ROUTES } from "@/constants/site";

export const metadata: Metadata = {
  title: "Announcements",
  description: `Current notices, circulars and admissions deadlines for ${SITE.name}, Colombo.`,
};

export default function AnnouncementsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Announcements"
        title="Current notices"
        lede="Operational notices with deadlines. Entries close automatically once their expiry date has passed, and anything urgent is pinned to the top."
      />

      <Section className="pt-0">
        <Suspense fallback={<ListSkeleton rows={6} />}>
          <AnnouncementsBoard />
        </Suspense>
      </Section>

      <Section className="border-t border-line bg-surface-sunken">
        <Note className="max-w-3xl">
          Announcements are published by the school in Sinhala and English. This
          board carries the English text. For the Sinhala originals, contact the
          school office on {SITE.contact.phoneDisplay}. Full circulars and
          downloadable papers are on the{" "}
          <Link
            href={ROUTES.downloads}
            className="text-accent underline underline-offset-4"
          >
            downloads page
          </Link>
          .
        </Note>
      </Section>
    </div>
  );
}