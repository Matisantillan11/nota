import type { ReactNode } from "react";

import type { GarmentModelId } from "~/components/widgets/hangar-scene";

export type CartItem = {
  pieceId: string;
  name: string;
  size: string;
  /** Colourway label; null when the piece has a single colourway. */
  variant: string | null;
  /** The garment's 3D model, so checkout can pack the folded version. */
  model: GarmentModelId;
};

export type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (index: number) => void;
};

export type CartProviderProps = { children: ReactNode };
