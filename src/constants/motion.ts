export const EASE = {
  strongOut: [0.23, 1, 0.32, 1],
  strongInOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
  swiftOut: [0.16, 1, 0.3, 1],
} as const;

export const DURATION = {
  press: 0.12,
  tooltip: 0.16,
  popover: 0.2,
  dropdown: 0.22,
  modal: 0.28,
  drawer: 0.42,
  reveal: 0.62,
  scrubbed: 0.5,
} as const;

export const SPRING = {
  apple: { type: "spring", duration: 0.5, bounce: 0.2 },
  gentle: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  firm: { type: "spring", stiffness: 260, damping: 26, mass: 0.8 },
  drag: { type: "spring", stiffness: 180, damping: 18, mass: 1 },
  overshoot: { type: "spring", stiffness: 340, damping: 14, mass: 0.7 },
} as const;

export const STAGGER = {
  tight: 0.045,
  standard: 0.07,
  loose: 0.11,
} as const;

export const SCALE = {
  entranceMin: 0.94,
  entranceMax: 0.97,
  press: 0.97,
} as const;

export const VIEWPORT = {
  once: { once: true, amount: 0.25 },
  early: { once: true, amount: 0.1 },
  late: { once: true, amount: 0.5 },
} as const;

export type EaseName = keyof typeof EASE;