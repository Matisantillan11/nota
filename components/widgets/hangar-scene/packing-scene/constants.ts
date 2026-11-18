// World width of the shipping box; everything else is sized against it.
export const BOX_WIDTH = 2.6;
// Share of the box body's footprint usable inside (the walls).
export const BOX_INNER = 0.88;
export const BOX_FLOOR = 0.1;

// Seconds: first drop, gap between drops, one fall, settle, then the close.
export const PACKING = {
  firstDrop: 0.6,
  gap: 0.85,
  fall: 0.7,
  settle: 0.25,
  // The close starts the moment the last garment settles.
  closeAfter: 0,
} as const;

// Seconds after the last garment settles: when each flap folds, and the fade
// from the folded open box to the closed model.
export const CLOSING = {
  // Flaps overlap in time, each starting before the last one lands, for one
  // gradual close; each rests on the ones before it.
  left: [0, 0.7],
  right: [0.45, 1.15],
  back: [0.9, 1.7],
  crossfade: [1.75, 2.15],
} as const satisfies Record<string, readonly [number, number]>;

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
