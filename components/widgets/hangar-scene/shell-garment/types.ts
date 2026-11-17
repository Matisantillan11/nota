import type { RefObject } from "react";
import type { ShellModel, TurnState, Vec3 } from "../types";

export interface ShellGarmentProps {
  model: ShellModel;
  position: Vec3;
  index: number;
  stops: number[];
  totalStops: number;
  progressRef: RefObject<number>;
  turnsRef: RefObject<TurnState[]>;
  reducedMotion: boolean;
}
