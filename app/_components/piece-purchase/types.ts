import type { Piece } from "~/app/_types/drop";

export interface PiecePurchaseProps {
  piece: Piece;
  variantId: string;
  onVariantChange: (variantId: string) => void;
  /** Distinguishes the radio groups when the same piece appears twice. */
  idSuffix: string;
  className?: string;
}
