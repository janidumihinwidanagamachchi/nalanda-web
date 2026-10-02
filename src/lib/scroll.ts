"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/components/motion/smooth-scroll";

let registered = false;

export function registerScrollTrigger() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return ScrollTrigger;
}

export function bridgeLenis() {
  const lenis = getLenis();
  if (!lenis) return () => {};
  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);
  return () => {
    lenis.off("scroll", onScroll);
  };
}

export { gsap, ScrollTrigger };