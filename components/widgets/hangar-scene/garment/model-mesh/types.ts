import type { RefObject } from "react";
import type { Material } from "three";

export interface ModelMeshProps {
  src: string;
  /**
   * During a swap the incoming state shows below the scan line and the
   * outgoing one above it; null shows the model whole.
   */
  clip: "below" | "above" | null;
  /** Height (world y) of the scan line, written by the parent each frame. */
  cutRef: RefObject<number>;
  /** Self-light this layer ramps up to (0 = none). */
  glow?: number;
  /** Materials the parent fades; this layer registers its own. */
  materialsRef: RefObject<Set<Material>>;
}
