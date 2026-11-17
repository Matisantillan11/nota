import type { RefObject } from "react";
import type { GarmentModelId, TurnState, Vec3 } from "../types";

export interface GarmentProps {
  model: GarmentModelId;
  position: Vec3;
  /** Index into the shared turn states. */
  index: number;
  /** Camera stops at which this garment is on screen. */
  stops: number[];
  totalStops: number;
  progressRef: RefObject<number>;
  turnsRef: RefObject<TurnState[]>;
  revealed: boolean;
  reducedMotion: boolean;
}
