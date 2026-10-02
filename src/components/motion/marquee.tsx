"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({
  children,
  speed = 38,
  className = "",
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`group relative flex w-full overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max shrink-0 items-center"
        style={
          reduce
            ? undefined
            : {
                animation: `marquee-scroll ${speed}s linear infinite`,
                animationDirection: reverse ? "reverse" : "normal",
              }
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </motion.div>
      {pauseOnHover ? (
        <style>{`
          @media (hover: hover) and (pointer: fine) {
            .group:hover [style*="marquee-scroll"] {
              animation-play-state: paused;
            }
          }
        `}</style>
      ) : null}
    </div>
  );
}

export function PulseDot({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <span
      className={`inline-block size-1.5 rounded-full bg-accent ${className}`}
      style={reduce ? undefined : { animation: "pulse-soft 2.6s ease-in-out infinite" }}
      aria-hidden
    />
  );
}