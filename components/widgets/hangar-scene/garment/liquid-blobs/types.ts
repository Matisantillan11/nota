import type { RefObject } from "react";

export interface LiquidBlobsProps {
  /** The garment's 0–1 visibility: droplets swell in and out with it. */
  visibility: RefObject<number>;
  still: boolean;
}
