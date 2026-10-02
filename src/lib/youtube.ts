import { YOUTUBE_CHANNEL_ID } from "@/data/channels";

export interface YoutubeVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
}

export interface YoutubeFeed {
  title: string;
  videos: YoutubeVideo[];
  newestPublished: string | null;
  stale: boolean;
  available: boolean;
}

const STALE_AFTER_DAYS = 365;

export async function fetchYoutubeFeed(): Promise<YoutubeFeed> {
  const fallback: YoutubeFeed = {
    title: "Nalanda College",
    videos: [],
    newestPublished: null,
    stale: true,
    available: false,
  };

  try {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return fallback;

    const xml = new TextDecoder().decode(await response.arrayBuffer());
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(
      (match) => match[1],
    );

    const pick = (block: string, tag: string) =>
      block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() ?? "";

    const videos = entries.map((block) => {
      const videoId = pick(block, "yt:videoId");
      return {
        id: videoId,
        title: pick(block, "title"),
        published: pick(block, "published"),
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    });

    const newest = videos[0]?.published ?? null;
    const ageDays = newest
      ? (Date.now() - new Date(newest).getTime()) / 86_400_000
      : Infinity;

    return {
      title: pick(xml, "title") || "Nalanda College",
      videos: videos.slice(0, 6),
      newestPublished: newest,
      stale: ageDays > STALE_AFTER_DAYS,
      available: videos.length > 0,
    };
  } catch {
    return fallback;
  }
}
