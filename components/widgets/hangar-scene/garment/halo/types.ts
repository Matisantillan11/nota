import type { RefObject } from "react";

export interface HaloProps {
  /** 0–1 strength at full visibility. */
  strength: number;
  /** The garment's 0–1 visibility, so the halo fades with it. */
  visibility: RefObject<number>;
  /** Light colour of the mist. */
  color: string;
  /** Reduced motion: the mist holds still. */
  still: boolean;
}
