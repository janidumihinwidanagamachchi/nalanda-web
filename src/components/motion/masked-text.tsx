"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DURATION, EASE, STAGGER } from "@/constants/motion";

type MaskedTextProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  animateOnMount?: boolean;
};

export function MaskedText({
  text,
  className,
  delay = 0,
  as = "span",
  animateOnMount = false,
}: MaskedTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const Comp = motion[as];

  if (reduce) return <Comp className={className}>{text}</Comp>;

  const variants = {
    hidden: {},
    shown: { transition: { staggerChildren: STAGGER.standard, delayChildren: delay } },
  };

  const word = {
    hidden: { y: "110%" },
    shown: {
      y: "0%",
      transition: { duration: DURATION.reveal, ease: EASE.strongOut },
    },
  };

  const inner = (
    <>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.12em]"
        >
          <motion.span className="inline-block will-change-transform" variants={word}>
            {w}
          </motion.span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </>
  );

  if (animateOnMount) {
    return (
      <Comp className={className} variants={variants} initial="hidden" animate="shown">
        {inner}
      </Comp>
    );
  }

  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
    >
      {inner}
    </Comp>
  );
}

type ScrollMaskedTextProps = MaskedTextProps & {
  amount?: number;
};

export function ScrollMaskedText({
  text,
  className,
  delay = 0,
  as = "h2",
  amount = 0.4,
}: ScrollMaskedTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const Comp = motion[as];

  if (reduce) return <Comp className={className}>{text}</Comp>;

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        shown: {
          transition: { staggerChildren: STAGGER.standard, delayChildren: delay },
        },
      }}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.12em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%" },
              shown: {
                y: "0%",
                transition: { duration: DURATION.reveal, ease: EASE.strongOut },
              },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Comp>
  );
}

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

export function SplitText({
  text,
  className,
  delay = 0,
  as = "span",
}: SplitTextProps) {
  const Tag = as as React.ElementType;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  if (reduce) return <Tag className={className}>{text}</Tag>;

  const chars = Array.from(text);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: "60%" }}
          animate={started ? { opacity: 1, y: "0%" } : {}}
          transition={{
            duration: DURATION.popover,
            delay: delay + i * 0.018,
            ease: EASE.swiftOut,
          }}
        >
          {c === " " ? <span>&nbsp;</span> : c}
        </motion.span>
      ))}
    </Tag>
  );
}