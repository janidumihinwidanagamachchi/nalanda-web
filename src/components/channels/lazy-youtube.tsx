"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react/dist/ssr";

type Props = {
  videoId: string;
  title: string;
  thumbnail: string;
  className?: string;
};

/**
 * YouTube embed behind a poster image.
 *
 * The poster is not only a nicety: a real iframe pulls several hundred
 * kilobytes of player JavaScript from a third party, so it is not loaded until
 * the reader asks for it. The observer below only pre-arms the state when the
 * slot is about to scroll into view; nothing animates in.
 */
export function LazyYouTube({ videoId, title, thumbnail, className }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const node = holder.current;
    if (!node || active) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "250px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div
      ref={holder}
      className={`relative aspect-video overflow-hidden rounded-xl border bg-alt ${className ?? ""}`}
    >
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          aria-label={`Play ${title}`}
        >
          <Image
            src={thumbnail}
            alt=""
            width={480}
            height={270}
            loading="lazy"
            unoptimized
            className="size-full object-cover transition-transform duration-[var(--motion-base)] ease-[var(--ease-out-quint)] group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-canvas/30 transition-colors duration-[var(--motion-fast)] group-hover:bg-canvas/10" />
          <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-panel text-brand shadow-lg">
            <Play size={22} weight="fill" />
          </span>
        </button>
      )}
    </div>
  );
}