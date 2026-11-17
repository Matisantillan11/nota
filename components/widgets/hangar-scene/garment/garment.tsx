"use client";

import { GARMENT_MODELS } from "../constants";
import ShellGarment from "../shell-garment";
import TurntableGarment from "../turntable-garment";
import type { GarmentProps } from "./types";

function Garment({ model, ...props }: GarmentProps) {
  const garment = GARMENT_MODELS[model];
  return garment.kind === "shell" ? (
    <ShellGarment model={garment} {...props} />
  ) : (
    <TurntableGarment model={garment} {...props} />
  );
}

export default Garment;
