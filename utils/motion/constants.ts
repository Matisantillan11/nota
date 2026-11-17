// Motion tokens from DESIGN.md → Motion. GSAP takes seconds.
export const MOTION_DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1.2,
} as const;

export const MOTION_EASE = {
  default: "power3.out",
  reveal: "expo.out",
  inOut: "power2.inOut",
} as const;

export const MOTION_STAGGER = 0.06;

// gsap.matchMedia() conditions: every timeline branches on these.
export const MOTION_QUERIES = {
  full: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
