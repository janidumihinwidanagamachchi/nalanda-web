import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { LazyYouTube } from "@/components/channels/lazy-youtube";
import { EmbedSlot, VerificationNote } from "@/components/channels/embed-slot";
import { CHANNELS, PLATFORM_ORDER, VERIFICATION_NOTE } from "@/data/channels";
import { fetchYoutubeFeed } from "@/lib/youtube";
import { SITE } from "@/data/site";
import { Card } from "@/components/ui/panel";
import { Stat } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Channels",
  description: `Official websites, social media and media channels for ${SITE.name}, Colombo and its associations.`,
};

export const dynamic = "force-static";

export default async function ChannelsPage() {
  const feed = await fetchYoutubeFeed();
  const byPlatform = PLATFORM_ORDER.map((platform) => ({
    platform,
    entries: CHANNELS.filter((c) => c.platform === platform),
  })).filter((group) => group.entries.length > 0);

  const checked = CHANNELS.filter((c) => c.tier === "A").length;
  const unverified = CHANNELS.length - checked;

  return (
    <>
      <PageHeader
        eyebrow="Channels"
        title="Every official channel"
        lede={`${CHANNELS.length} official websites and social media pages, each labelled with how confidently it was verified.`}
      />

      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-7">
            <Stat label="Channels listed" value={CHANNELS.length} />
          </Card>
          <Card className="p-7">
            <Stat label="Checked and live" value={checked} />
          </Card>
          <Card className="p-7">
            <Stat label="Not machine-checkable" value={unverified} />
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Broadcast"
          title="Video"
          lede={`Read live from the ${feed.title} channel's public feed, with no API key required.`}
        />

        {feed.available ? (
          <>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {feed.videos.map((video) => (
                <figure key={video.id}>
                  <LazyYouTube
                    videoId={video.id}
                    title={video.title}
                    thumbnail={video.thumbnail}
                  />
                  <figcaption>
                    <h3 className="mt-4 text-sm leading-snug">{video.title}</h3>
                    <p className="mt-1 font-mono text-xs text-quiet-ink">
                      {formatDate(video.published)}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>

            {feed.stale ? (
              <Note tone="flagged" className="mt-12 max-w-3xl">
                The most recent upload on this channel is dated{" "}
                {formatDate(feed.newestPublished ?? "", { month: "long" })}
                , so the list above is not current. It is shown because it is what
                the channel&apos;s own public feed returns. Confirm which channel the
                college intends to publish to.
              </Note>
            ) : null}
          </>
        ) : (
          <Note tone="flagged" className="mt-10 max-w-3xl">
            The channel feed could not be read at build time. The links below still
            work.
          </Note>
        )}
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Feeds"
          title="Social platforms"
          lede="These two platforms cannot be embedded without platform credentials. Until those are supplied, each renders as a designed link list rather than an empty frame."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <EmbedSlot platform="Instagram">
            <div className="grid gap-3">
              {CHANNELS.filter((c) => c.platform === "Instagram").map((c) => (
                <ChannelLink key={c.id} channel={c} />
              ))}
            </div>
          </EmbedSlot>
          <EmbedSlot platform="Facebook">
            <div className="grid gap-3">
              {CHANNELS.filter((c) => c.platform === "Facebook")
                .slice(0, 6)
                .map((c) => (
                  <ChannelLink key={c.id} channel={c} />
                ))}
            </div>
          </EmbedSlot>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Directory" title="All channels" />
        <div className="mt-12 grid gap-12">
          {byPlatform.map((group) => (
            <div key={group.platform}>
              <h3 className="field">{group.platform}</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.entries.map((channel) => (
                  <Card key={channel.id} className="p-6">
                    <p className="text-xs text-quiet-ink">{channel.entity}</p>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-1.5 block font-medium transition-colors duration-[var(--motion-fast)] hover:text-brand"
                    >
                      {channel.label}
                    </a>
                    <p className="field mt-4">
                      {channel.tier === "A" ? "Checked and live" : "Not checked"}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <VerificationNote />
          <div>
            <p className="display-tight text-3xl md:text-4xl">
              A directory is only as good as its weakest link, so every entry
              carries its own confidence.
            </p>
            <Note className="mt-8">{VERIFICATION_NOTE}</Note>
          </div>
        </div>
      </Section>
    </>
  );
}

function ChannelLink({ channel }: { channel: (typeof CHANNELS)[number] }) {
  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors duration-[var(--motion-fast)] hover:border-brand"
    >
      <span>
        <span className="block text-sm font-medium">{channel.label}</span>
        <span className="block text-xs text-quiet-ink">{channel.entity}</span>
      </span>
      <span
        className={`size-2 shrink-0 rounded-full ${
          channel.tier === "A" ? "bg-emerald-600" : "bg-field"
        }`}
        aria-label={channel.tier === "A" ? "Checked and live" : "Not checked"}
      />
    </a>
  );
}