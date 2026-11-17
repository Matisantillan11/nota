import Image from "next/image";

import { cn } from "~/utils/cn";

import { GARMENT_MODELS } from "../constants";
import type { PosterProps } from "./types";

// Still stand-in for the 3D garment: shown while the scene loads and when
// WebGL is unavailable, so the page never depends on the canvas.
function Poster({ model, label, className }: PosterProps) {
  const { src, width, height } = GARMENT_MODELS[model].poster;

  return (
    <Image
      src={src}
      alt={label}
      width={width}
      height={height}
      priority
      className={cn("h-auto", className)}
    />
  );
}

export default Poster;
