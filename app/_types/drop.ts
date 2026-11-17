import type { GarmentModelId } from "~/components/widgets/hangar-scene";

export type PieceVariant = {
  id: string;
  label: string;
  model: GarmentModelId;
};

export type Piece = {
  id: string;
  name: string;
  description: string;
  /** Colourways; the first is the default. One entry means no colour choice. */
  variants: PieceVariant[];
  sizes: string[];
  // null until real pricing exists; the UI says so instead of inventing one.
  price: { ars: number; usd: number } | null;
  available: boolean;
};

export type Drop = {
  id: string;
  number: string;
  name: string;
  status: "live" | "next";
  pieces: Piece[];
};
