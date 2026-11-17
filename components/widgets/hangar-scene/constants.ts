import type { GarmentFace, GarmentModel, GarmentModelId } from "./types";

const teeFace = (
  color: "white" | "black",
  side: "front" | "back",
  width: number,
  height: number,
): GarmentFace => ({
  src: `/garments/tee-${color}-${side}.webp`,
  depth: `/garments/tee-${color}-${side}-depth.webp`,
  normal: `/garments/tee-${color}-${side}-normal.webp`,
  width,
  height,
});

// Every raster carries its provenance in a sidecar next to it. Swap for real
// .glb exports when the brand has them.
export const GARMENT_MODELS: Record<GarmentModelId, GarmentModel> = {
  "hoodie-monochrome": {
    kind: "turntable",
    atlas: {
      src: "/garments/hoodie-monochrome-turn.webp",
      cols: 4,
      rows: 4,
      cellWidth: 652,
      cellHeight: 711,
    },
    range: Math.PI / 3,
    poster: {
      src: "/garments/hoodie-monochrome.webp",
      width: 725,
      height: 790,
    },
  },
  "tee-monochrome-white": {
    kind: "shell",
    front: teeFace("white", "front", 1024, 1009),
    back: teeFace("white", "back", 1024, 1009),
    glow: 0.35,
    poster: {
      src: "/garments/tee-white-front.webp",
      width: 1024,
      height: 1009,
    },
  },
  "tee-monochrome-black": {
    kind: "shell",
    front: teeFace("black", "front", 630, 677),
    back: teeFace("black", "back", 630, 677),
    glow: 0.95,
    poster: { src: "/garments/tee-black-front.webp", width: 630, height: 677 },
  },
};

// World-space height of every garment.
export const GARMENT_HEIGHT = 3;

// How far the inflated shells bulge from their silhouette (world units).
export const SHELL_DEPTH = 0.32;

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

export const MAX_DPR = 2;
