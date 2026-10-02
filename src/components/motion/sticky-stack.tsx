"use client";

import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { bridgeLenis, gsap, registerScrollTrigger } from "@/lib/scroll";

type StickyStackProps = {
  children: ReactNode[];
  itemSelector?: string;
};

export function StickyStack({ children, itemSelector }: StickyStackProps) {
  const scope = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      if (reduce) return;
      registerScrollTrigger();
      const bridge = bridgeLenis();

      const selector = itemSelector ?? "[data-stack-card]";
      const cards = gsap.utils.toArray<HTMLElement>(selector);

      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: next,
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        gsap.to(card, {
          scale: 0.92,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });

      return () => bridge();
    },
    { scope, dependencies: [reduce], revertOnUpdate: true },
  );

  if (reduce) {
    return (
      <div className="space-y-6">
        {children.map((child, i) => (
          <div key={i}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={scope}>
      {children.map((child, i) => (
        <div
          key={i}
          data-stack-card
          className="sticky top-0 flex min-h-[100dvh] items-center py-20"
        >
          {child}
        </div>
      ))}
    </div>
  );
}

type HorizontalPanProps = {
  children: ReactNode;
  trackSelector?: string;
};

export function HorizontalPan({ children, trackSelector }: HorizontalPanProps) {
  const scope = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      if (reduce) return;
      registerScrollTrigger();
      const bridge = bridgeLenis();

      const wrap = scope.current;
      if (!wrap) return;
      const track = trackSelector
        ? wrap.querySelector<HTMLElement>(trackSelector)
        : wrap.firstElementChild;
      if (!track) return;

      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        bridge();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope, dependencies: [reduce], revertOnUpdate: true },
  );

  if (reduce) {
    return (
      <div className="space-y-6">
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div ref={scope} className="relative overflow-hidden">
      <div className="flex h-[100dvh] w-max items-stretch">
        {children}
      </div>
    </div>
  );
}