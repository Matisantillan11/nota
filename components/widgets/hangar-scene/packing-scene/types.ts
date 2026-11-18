import type { GarmentModelId } from "../types";

export interface PackingSceneProps {
  /** Garments to pack, in order; each drops in as its folded model. */
  garments: GarmentModelId[];
  reducedMotion: boolean;
  /** Called once, when the box has closed. */
  onPacked?: () => void;
  /** Text alternative for the canvas. */
  label: string;
}
