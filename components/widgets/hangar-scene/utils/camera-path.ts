import { PIECE_SPACING } from "../constants";
import type { CameraStop, Vec3 } from "../types";

/** Viewport width (px) from which product sections use two columns. */
export const TWO_COLUMN_MIN_WIDTH = 768;
/** Max width (px) of the two-column container (Tailwind max-w-6xl). */
export const TWO_COLUMN_MAX_WIDTH = 1152;

const FOV = 35;
const HALF_FOV_TAN = Math.tan(((FOV / 2) * Math.PI) / 180);

interface Viewport {
  width: number;
  height: number;
  /** Whether the page laid sections out in two columns (CSS breakpoint). */
  columns: boolean;
}

// One stop per page section: the hatch, one per garment, then deep space for
// the closing section. On phones a garment sits centred above its text; from
// tablet up it alternates columns: left for even pieces, right for odd ones.
export function getCameraStops(
  pieceCount: number,
  { width, height, columns }: Viewport,
): CameraStop[] {
  const aspect = width / height;

  // Targets sit below the garment so it floats in the upper part of the
  // frame, inside the hatch, above the text dock.
  const hero: CameraStop = columns
    ? { position: [0, -0.4, 12.5], target: [0, -1.1, 0] }
    : { position: [0, -0.9, 15], target: [0, -1.5, 0] };

  // Two columns: keep the garment no wider than ~42% of the viewport, and
  // shift the camera so it lands on the left column's centre.
  const distance = Math.max(11, 7.2 / aspect / (2 * HALF_FOV_TAN));
  const visibleWidth = 2 * distance * HALF_FOV_TAN * aspect;
  const columnCentre = Math.min(width, TWO_COLUMN_MAX_WIDTH) / 4 / width;
  const shift = columnCentre * visibleWidth;

  const pieces = Array.from({ length: pieceCount }, (_, i): CameraStop => {
    const z = -i * PIECE_SPACING;
    // Camera shifted right puts the garment in the left column, and back.
    const x = i % 2 === 0 ? shift : -shift;
    return columns
      ? { position: [x, 0, z + distance], target: [x, 0, z] }
      : { position: [0, -2.75, z + 17], target: [0, -2.75, z] };
  });

  const lastZ = -(pieceCount - 1) * PIECE_SPACING;
  const deep: CameraStop = {
    position: [0, 0, lastZ - 10],
    target: [0, 0, lastZ - 40],
  };

  return [hero, ...pieces, deep];
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

// Progress 0 → 1 maps evenly onto the stops; each leg eases in and out so the
// camera settles on a section instead of gliding through it.
export function sampleCameraPath(
  stops: CameraStop[],
  progress: number,
): CameraStop {
  const scaled = Math.min(Math.max(progress, 0), 1) * (stops.length - 1);
  const index = Math.min(Math.floor(scaled), stops.length - 2);
  const t = smoothstep(scaled - index);
  const from = stops[index];
  const to = stops[index + 1];
  return {
    position: lerp3(from.position, to.position, t),
    target: lerp3(from.target, to.target, t),
  };
}
