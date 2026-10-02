"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react";

type Props = {
  videoId: string;
  title: string;
  thumbnail: string;
  className?: string;
};

export function LazyYouTube({ videoId, title, thumbnail, className = "" }: Props) {
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
      className={`relative aspect-video overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-sunken ${className}`}
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
          className="group absolute inset-0 size-full"
          aria-label={`Play ${title}`}
        >
          <Image
            src={thumbnail}
            alt=""
            width={480}
            height={270}
            loading="lazy"
            unoptimized
            className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-surface/30 transition-colors duration-300 group-hover:bg-surface/10" />
          <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised text-accent shadow-lg">
            <Play size={22} weight="fill" />
          </span>
        </button>
      )}
    </div>
  );
}