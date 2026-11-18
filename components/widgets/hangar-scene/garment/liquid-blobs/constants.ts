import type { Vec3 } from "../../types";

// Chrome droplets around a garment: position (relative to it) and radius.
// Kept within ~1.5 units sideways and set back, so they hug the garment and
// never drift into the text column beside it.
export const BLOBS: { position: Vec3; radius: number; speed: number }[] = [
  { position: [-1.45, 1.15, -1.6], radius: 0.4, speed: 0.9 },
  { position: [1.45, -0.95, -1.2], radius: 0.28, speed: 1.2 },
  { position: [0.95, 1.6, -2.6], radius: 0.55, speed: 0.7 },
  { position: [-1.2, -1.5, -2.2], radius: 0.2, speed: 1.4 },
];
