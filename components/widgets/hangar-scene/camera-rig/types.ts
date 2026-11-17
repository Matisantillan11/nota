import type { RefObject } from "react";

export interface CameraRigProps {
  pieceCount: number;
  progressRef: RefObject<number>;
  reducedMotion: boolean;
}
