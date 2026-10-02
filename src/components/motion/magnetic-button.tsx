"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { useFinePointer } from "@/lib/pointer";
import { DURATION, EASE, SCALE, SPRING } from "@/constants/motion";

type MagneticProps = {
  children: ReactNode;
  href?: string;
  strength?: number;
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  external?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const VARIANTS = {
  solid:
    "bg-accent text-surface-raised hover:bg-accent-hover border border-transparent",
  outline:
    "border border-line-strong text-ink hover:border-accent hover:text-accent",
  ghost: "text-ink hover:text-accent",
};

export function MagneticButton({
  children,
  href,
  strength = 0.28,
  className = "",
  variant = "solid",
  external = false,
  ariaLabel,
  onClick,
  type = "button",
}: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.firm);
  const springY = useSpring(y, SPRING.firm);
  const transform = useTransform(
    [springX, springY],
    ([tx, ty]: number[]) => `translateX(${tx}px) translateY(${ty}px)`,
  );
  const active = fine && !reduce;

  const onMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * strength * 100);
    y.set(relY * strength * 100);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={active ? { transform } : undefined}
      className="inline-block"
    >
      <motion.span
        className={`inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${VARIANTS[variant]} ${className}`}
        whileTap={{ scale: SCALE.press }}
        transition={{ duration: DURATION.press, ease: EASE.strongOut }}
      >
        {children}
      </motion.span>
    </motion.span>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className="inline-block"
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className="inline-block">
      {inner}
    </button>
  );
}