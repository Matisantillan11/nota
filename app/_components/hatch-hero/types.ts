import type { Drop } from "~/app/_types/drop";
import type { RefObject } from "react";
import type { TurnState } from "~/components/widgets/hangar-scene";

export interface HatchHeroProps {
  drop: Drop;
  reducedMotion: boolean;
  variantId: string;
  onVariantChange: (variantId: string) => void;
  turnsRef: RefObject<TurnState[]>;
}
