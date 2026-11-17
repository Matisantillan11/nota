import type { RefObject } from "react";

export type GarmentModelId =
  "hoodie-monochrome" | "tee-monochrome-white" | "tee-monochrome-black";

export interface GarmentModel {
  /** Optimized glTF binary (see `pnpm models:optimize`). */
  src: string;
  /**
   * A second state of the same garment that the first turn switches on
   * (the hoodie's lit reflective lines).
   */
  lit?: string;
  /** Self-light the lit state ramps up to, so "lights on" reads clearly. */
  litGlow?: number;
  /** Strength of the soft light behind the garment (0–1). */
  halo: number;
}

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
  /** False while the loading gate still covers the scene. */
  revealed: boolean;
  reducedMotion: boolean;
  /** Text alternative for the canvas. */
  label: string;
}

export type Vec3 = [number, number, number];

export interface CameraStop {
  position: Vec3;
  target: Vec3;
}
