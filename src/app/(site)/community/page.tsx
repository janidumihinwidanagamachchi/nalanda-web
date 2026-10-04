import type { Metadata } from "next";
import { COMMUNITY_BODIES, INTERNATIONAL_BRANCHES } from "@/data/community";
import { PageHeader, Section, SectionHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The bodies around the college: the OBA, the junior OBA, the communication unit, the sports club, the scout group and international branches.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="The bodies around the college"
        lede="Organisations that belong to Nalanda rather than to the school, and which carry much of its life outside the classroom."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {COMMUNITY_BODIES.map((body) => (
            <Card key={body.slug} className="flex flex-col p-7">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{body.kind}</Badge>
                <span className="font-mono text-xs text-quiet-ink">
                  {body.founded}
                </span>
              </div>

              <h2 className="mt-4 font-serif text-xl leading-snug">{body.name}</h2>
              <p className="mt-3 flex-1 text-sm text-quiet-ink">{body.summary}</p>

              {body.links?.length ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {body.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs text-ink transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand"
                      >
                        {link.label}
                        {link.verified ? (
                          <span className="ml-1.5 text-emerald-600" title="Checked over HTTP, live">
                            &check;
                          </span>
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Overseas"
          title="International branches"
          lede="Old Nalandians' associations outside Sri Lanka."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INTERNATIONAL_BRANCHES.map((branch) => (
            <Card key={branch.region} className="p-6">
              <p className="field">{branch.region}</p>
              <ul className="mt-4 grid gap-2 text-sm">
                {branch.links?.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="wipe text-brand"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}