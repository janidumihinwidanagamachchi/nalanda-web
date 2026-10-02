"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { EASE } from "@/constants/motion";

type CountUpProps = {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

export function CountUp({
  value,
  duration = 1.6,
  suffix = "",
  prefix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const counter = useMotionValue(0);
  const text = useTransform(counter, (v) =>
    `${prefix}${Math.round(v).toLocaleString("en-LK")}${suffix}`,
  );

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(counter, value, {
      duration,
      ease: EASE.strongOut,
    });
    return () => controls.stop();
  }, [counter, duration, inView, reduce, value]);

  if (reduce) {
    return (
      <span className={className}>
        {prefix}
        {value.toLocaleString("en-LK")}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
    </span>
  );
}