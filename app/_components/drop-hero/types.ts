import type { Drop } from "~/app/_types/drop";
import type { RefObject } from "react";
import type { TurnState } from "~/components/widgets/hangar-scene";

export interface DropHeroProps {
  drop: Drop;
  variantId: string;
  onVariantChange: (variantId: string) => void;
  turnsRef: RefObject<TurnState[]>;
}
