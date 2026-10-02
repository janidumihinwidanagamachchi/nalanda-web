import type { Metadata } from "next";
import { PageHeader, Section, SectionHeader, Note } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/masked-text";
import { LazyYouTube } from "@/components/channels/lazy-youtube";
import { EmbedSlot, VerificationNote } from "@/components/channels/embed-slot";
import { CHANNELS, PLATFORM_ORDER, VERIFICATION_NOTE } from "@/data/channels";
import { fetchYoutubeFeed } from "@/lib/youtube";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Channels",
  description: `Official websites, social media and media channels for ${SITE.name}, Colombo and its associations.`,
};

export const revalidate = 3600;

export default async function ChannelsPage() {
  const feed = await fetchYoutubeFeed();
  const byPlatform = PLATFORM_ORDER.map((platform) => ({
    platform,
    entries: CHANNELS.filter((c) => c.platform === platform),
  })).filter((group) => group.entries.length > 0);

  const checked = CHANNELS.filter((c) => c.tier === "A").length;
  const unverified = CHANNELS.length - checked;

  return (
    <div>
      <PageHeader
        eyebrow="Channels"
        title="Every official channel"
        lede={`${CHANNELS.length} official websites and social media pages, each labelled with how confidently it was verified.`}
      />

      <Section className="pt-0">
        <Stagger className="grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
          <StaggerItem className="bg-surface-raised p-7">
            <p className="font-display text-4xl">{CHANNELS.length}</p>
            <p className="mt-2 text-sm text-ink-muted">Channels listed</p>
          </StaggerItem>
          <StaggerItem className="bg-surface-raised p-7">
            <p className="font-display text-4xl">{checked}</p>
            <p className="mt-2 text-sm text-ink-muted">Checked and live</p>
          </StaggerItem>
          <StaggerItem className="bg-surface-raised p-7">
            <p className="font-display text-4xl">{unverified}</p>
            <p className="mt-2 text-sm text-ink-muted">Not machine-checkable</p>
          </StaggerItem>
        </Stagger>
      </Section>

      <Section className="border-y border-line bg-surface-sunken">
        <SectionHeader
          eyebrow="Broadcast"
          title="Video"
          lede={`Read live from the ${feed.title} channel&rsquo;s public feed, with no API key required.`}
        />

        {feed.available ? (
          <>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {feed.videos.map((video, index) => (
                <Reveal key={video.id} delay={index * 0.06}>
                  <LazyYouTube
                    videoId={video.id}
                    title={video.title}
                    thumbnail={video.thumbnail}
                  />
                  <h3 className="mt-4 text-sm leading-snug">{video.title}</h3>
                  <p className="mt-1 font-mono text-xs text-ink-subtle">
                    {new Date(video.published).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </Reveal>
              ))}
            </div>

            {feed.stale ? (
              <Note tone="flagged" className="mt-12 max-w-3xl">
                The most recent upload on this channel is dated{" "}
                {new Date(feed.newestPublished ?? "").toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                , so the list above is not current. It is shown because it is what the
                channel&rsquo;s own public feed returns. Confirm which channel the college
                intends to publish to.
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
          lede="These two platforms cannot be embedded without platform credentials. Until those are supplied, each renders as a designed link card rather than an empty frame."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <EmbedSlot platform="Instagram">
            <div className="space-y-3">
              {CHANNELS.filter((c) => c.platform === "Instagram").map((c) => (
                <ChannelLink key={c.id} channel={c} />
              ))}
            </div>
          </EmbedSlot>
          <EmbedSlot platform="Facebook">
            <div className="space-y-3">
              {CHANNELS.filter((c) => c.platform === "Facebook").slice(0, 6).map(
                (c) => (
                  <ChannelLink key={c.id} channel={c} />
                ),
              )}
            </div>
          </EmbedSlot>
        </div>
      </Section>

      <Section className="border-y border-line bg-surface-sunken">
        <SectionHeader eyebrow="Directory" title="All channels" />
        <div className="mt-12 space-y-12">
          {byPlatform.map((group) => (
            <div key={group.platform}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                {group.platform}
              </h3>
              <Stagger className="mt-5 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
                {group.entries.map((channel) => (
                  <StaggerItem key={channel.id} className="bg-surface-raised p-6">
                    <p className="text-xs text-ink-subtle">{channel.entity}</p>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-1.5 block font-medium transition-colors hover:text-accent"
                    >
                      {channel.label}
                    </a>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
                      {channel.tier === "A" ? "Checked and live" : "Not checked"}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <VerificationNote />
          </div>
          <div className="md:col-span-6">
            <SplitText
              as="p"
              text="A directory is only as good as its weakest link, so every entry carries its own confidence."
              className="display-tight text-3xl md:text-4xl"
            />
            <Note className="mt-8">{VERIFICATION_NOTE}</Note>
          </div>
        </div>
      </Section>
    </div>
  );
}

function ChannelLink({ channel }: { channel: (typeof CHANNELS)[number] }) {
  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center justify-between gap-4 rounded-[var(--radius-control)] border border-line px-4 py-3 transition-colors hover:border-accent"
    >
      <span>
        <span className="block text-sm font-medium">{channel.label}</span>
        <span className="block text-xs text-ink-subtle">{channel.entity}</span>
      </span>
      <span
        className={`size-2 shrink-0 rounded-full ${
          channel.tier === "A" ? "bg-emerald-600" : "bg-line-strong"
        }`}
        aria-label={channel.tier === "A" ? "Checked and live" : "Not checked"}
      />
    </a>
  );
}