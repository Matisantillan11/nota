import { SWAP_SECONDS } from "../constants";

// World width of the shipping box; everything else is sized against it.
export const BOX_WIDTH = 2.6;
// Share of the box body's footprint usable inside (the walls).
export const BOX_INNER = 0.88;
export const BOX_FLOOR = 0.1;

// Seconds: first drop, gap between drops, one fall, then the settle.
export const PACKING = {
  firstDrop: 0.6,
  gap: 0.85,
  fall: 0.7,
  settle: 0.25,
} as const;

// The open box hands over to the closed one with the garments' scan swap:
// a line of light sweeps up, closed below it, open above. It starts `delay`
// seconds after the last garment settles.
export const SEAL = { delay: 1, scan: SWAP_SECONDS } as const;

// Where the open box's body sits inside its bounding box (measured on
// assets-src/models/open-shipping-box.glb, in the model's own units): the
// opened flaps make the bounding box wider and deeper than the body.
export const BOX_GEOMETRY = {
  modelWidth: 1.902,
  // Lowest point of the model (the box's floor) and the top of its walls.
  minY: -0.529,
  rimY: 0.19,
  body: { minX: -0.59, maxX: 0.58, minZ: -0.33, maxZ: 0.62 },
} as const;

// Height above the box a garment falls from.
export const DROP_HEIGHT = 3.2;

export const CAMERA = {
  position: [0, 3.4, 7.2] as [number, number, number],
  fov: 35,
  // Where the camera looks, by canvas shape: on tall canvases (phones) it
  // looks higher so the box sits low and the falls read from above; wide
  // canvases have the height to keep the box nearer the middle.
  targetY: { tall: 1.5, wide: 0.9 },
};
