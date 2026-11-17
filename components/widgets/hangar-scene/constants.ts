import type { GarmentModel, GarmentModelId } from "./types";

// Optimized from the brand's models in assets-src/models (pnpm models:optimize).
export const GARMENT_MODELS: Record<GarmentModelId, GarmentModel> = {
  "hoodie-monochrome": {
    src: "/models/hoodie-off.glb",
    lit: "/models/hoodie-on.glb",
    // Strong on purpose: masked to the lit lines, it renders them pure white.
    litGlow: 4,
    halo: 0.55,
  },
  // A white garment needs less light behind it to keep its own edge.
  "tee-monochrome-white": { src: "/models/tee-white.glb", halo: 0.35 },
  "tee-monochrome-black": { src: "/models/tee-black.glb", halo: 0.77 },
};

// World-space height of every garment.
export const GARMENT_HEIGHT = 3;

// Mirrors app/globals.css `background` — three can't read CSS vars.
export const SCENE_BACKGROUND = "#06060a";

// Distance between pieces along the camera's flight path (-z).
export const PIECE_SPACING = 24;

// Star fog: depth cue for the starfield only (garments ignore fog).
export const FOG = { near: 16, far: 40 } as const;

// Radians of turn per pixel dragged.
export const DRAG_SENSITIVITY = 0.012;

// Garment visibility by distance to its camera stop, in stops: fully shown
// within `hold`, gone by `gone` — so two pieces are never on screen together.
export const STOP_FADE = { hold: 0.1, gone: 0.42 } as const;

// Pixel ratio ceiling; drops to MIN_DPR when the device can't hold the frame rate.
export const MAX_DPR = 1.5;
export const MIN_DPR = 1;

// Soft light behind each garment: neutral, a touch cool, never the signal
// blue (no colour on garments). Size relative to the garment's height.
export const HALO_COLOR = "#e9eef5";
// Room for the uneven outline to drift without touching the quad's edge.
export const HALO_SIZE = 2;

// Scan wipe between two states of a garment (colour swap, lights on).
export const SWAP_SECONDS = 1.1;
// One pace for every garment's turn, first turn and after (rad/s).
export const TURN_SPEED = 1.5;
// Turning this much (one full revolution) switches a lit state on.
export const LIGHTS_ON_AFTER = Math.PI * 2;
