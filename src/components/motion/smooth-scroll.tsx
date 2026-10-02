"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import Lenis from "lenis";

let instance: Lenis | null = null;

export const getLenis = () => instance;

export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      instance?.destroy();
      instance = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });
    instance = lenis;

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, [reduce]);

  return null;
}