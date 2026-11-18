import type { Object3D } from "three";

export interface FittedModel {
  object: Object3D;
  /** World size after fitting: width (x), height (y), depth (z). */
  size: { x: number; y: number; z: number };
}

export interface FitOptions {
  /** Fit inside this footprint (x, z); the model may turn 90° to fit best. */
  width: number;
  depth: number;
  /** Optional cap on the fitted height. */
  height?: number;
}
