import type { Metadata } from "next";
import { PAST_PRINCIPALS, PRINCIPALS_NOTE } from "@/data/pastPrincipals";
import { PageHeader, Section, Note } from "@/components/ui/section";
import { Card } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Past Principals",
  description:
    "The principals who shaped Nalanda College, with the achievements and legacy recorded for each tenure.",
};

export default function PastPrincipalsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="The principals who shaped Nalanda"
        lede={`${PAST_PRINCIPALS.length} tenures are published, from ${PAST_PRINCIPALS[PAST_PRINCIPALS.length - 1].from} to ${PAST_PRINCIPALS[0].to}.`}
      />

      <Section>
        <div className="grid gap-6">
          {PAST_PRINCIPALS.map((principal) => (
            <Card key={principal.name} className="p-7 md:p-9">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-10">
                <div>
                  <h2 className="font-serif text-2xl leading-snug">
                    {principal.name}
                  </h2>
                  <p className="field mt-2">{principal.tenure}</p>
                  <p className="measure mt-5 text-sm text-quiet-ink">
                    {principal.summary}
                  </p>
                </div>
                <div className="flex items-start gap-6 md:text-right">
                  <div>
                    <p className="field">From</p>
                    <p className="font-mono text-sm">{principal.from}</p>
                  </div>
                  <div>
                    <p className="field">To</p>
                    <p className="font-mono text-sm">{principal.to}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <p className="field">Achievements</p>
                  <ul className="mt-4 grid gap-2.5 text-sm">
                    {principal.achievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="field">Legacy</p>
                  <ul className="mt-4 grid gap-2.5 text-sm">
                    {principal.legacy.map((item) => (
                      <li key={item} className="text-quiet-ink">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Note className="max-w-3xl">{PRINCIPALS_NOTE}</Note>
      </Section>
    </>
  );
}