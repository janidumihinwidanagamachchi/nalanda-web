"use client";

import { motion, useReducedMotion } from "motion/react";
import React, { type ReactNode } from "react";
import { DURATION, EASE, VIEWPORT } from "@/constants/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
  amount?: number;
  once?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  distance = 24,
  className,
  amount = VIEWPORT.once.amount,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: DURATION.reveal, delay, ease: EASE.strongOut }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  amount?: number;
  distance?: number;
};

export function Stagger({
  children,
  className,
  gap = 0.07,
  delay = 0,
  amount = VIEWPORT.once.amount,
  distance = 22,
}: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {React.Children.map(children, (child) => (
        <StaggerItem key={React.isValidElement(child) ? child.key : undefined} distance={distance}>
          {child}
        </StaggerItem>
      ))}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  distance?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
};

export function StaggerItem({
  children,
  distance = 22,
  className,
  as = "div",
}: StaggerItemProps) {
  const Comp = motion[as];
  const variants = {
    hidden: { opacity: 0, y: distance },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.reveal, ease: EASE.strongOut },
    },
  };

  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  );
}