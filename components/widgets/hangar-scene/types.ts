import type { RefObject } from "react";

export type GarmentModelId =
  "hoodie-monochrome" | "tee-monochrome-white" | "tee-monochrome-black";

export interface GarmentFace {
  src: string;
  depth: string;
  normal: string;
  width: number;
  height: number;
}

/** A 2.5D garment: front and back renders inflated from their silhouettes. */
export interface ShellModel {
  kind: "shell";
  front: GarmentFace;
  back: GarmentFace;
  /** Self-light so the render's own studio light survives on dark fabric. */
  glow: number;
  poster: { src: string; width: number; height: number };
}

/** Real footage of the garment turning, scrubbed by the drag angle. */
export interface TurntableModel {
  kind: "turntable";
  atlas: {
    src: string;
    cols: number;
    rows: number;
    cellWidth: number;
    cellHeight: number;
  };
  /** Largest angle (radians) either side of the rest frame the footage covers. */
  range: number;
  poster: { src: string; width: number; height: number };
}

export type GarmentModel = ShellModel | TurntableModel;

/**
 * Turn state for one garment, shared between the page (which writes drag
 * input) and the scene (which integrates inertia and idle motion).
 */
export interface TurnState {
  /** Accumulated turn in radians. */
  angle: number;
  /** Radians per second, carried after a drag is released. */
  velocity: number;
  dragging: boolean;
  /** performance.now() of the last drag input. */
  lastInput: number;
}

export interface HangarSceneProps {
  /** Garment models in drop order; each gets its own stop on the camera path. */
  garments: GarmentModelId[];
  /** 0 → 1 across the page sections; written by the page's scroll timeline. */
  progressRef: RefObject<number>;
  /** One turn state per garment, written by `useTurnDrag` on the page. */
  turnsRef: RefObject<TurnState[]>;
  reducedMotion: boolean;
  /** Text alternative for the canvas. */
  label: string;
}

export type Vec3 = [number, number, number];

export interface CameraStop {
  position: Vec3;
  target: Vec3;
}
