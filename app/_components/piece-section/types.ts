import type { Piece } from "~/app/_types/drop";
import type { RefObject } from "react";
import type { TurnState } from "~/components/widgets/hangar-scene";

export interface PieceSectionProps {
  piece: Piece;
  variantId: string;
  onVariantChange: (variantId: string) => void;
  turnsRef: RefObject<TurnState[]>;
  /** Index of this piece's garment in the shared turn states. */
  index: number;
  /** Camera stop this section shows. */
  stop: number;
}
