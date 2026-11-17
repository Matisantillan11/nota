import type { ReactNode } from "react";

export type CartItem = {
  pieceId: string;
  name: string;
  size: string;
  /** Colourway label; null when the piece has a single colourway. */
  variant: string | null;
};

export type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (index: number) => void;
};

export type CartProviderProps = { children: ReactNode };
