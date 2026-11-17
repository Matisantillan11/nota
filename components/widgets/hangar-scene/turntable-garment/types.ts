import type { RefObject } from "react";
import type { TurnState, TurntableModel, Vec3 } from "../types";

export interface TurntableGarmentProps {
  model: TurntableModel;
  position: Vec3;
  index: number;
  stops: number[];
  totalStops: number;
  progressRef: RefObject<number>;
  turnsRef: RefObject<TurnState[]>;
  reducedMotion: boolean;
}
