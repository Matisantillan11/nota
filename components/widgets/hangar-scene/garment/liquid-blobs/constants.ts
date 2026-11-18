import type { Vec3 } from "../../types";

// Chrome droplets around a garment: position (relative to it), radius and
// float speed. Big ones sit well behind the garment so they frame it without
// covering it; small ones hover closer. All within ~1.7 units sideways, so
// they stay clear of the text column beside the garment.
export const BLOBS: { position: Vec3; radius: number; speed: number }[] = [
  { position: [-1.5, 1.2, -2.2], radius: 0.75, speed: 0.8 },
  { position: [1.35, 1.75, -3.2], radius: 1.05, speed: 0.6 },
  { position: [1.6, -1.05, -1.6], radius: 0.5, speed: 1.1 },
  { position: [-1.6, -1.4, -2.6], radius: 0.6, speed: 0.9 },
  { position: [-0.55, 2.15, -1.2], radius: 0.24, speed: 1.5 },
  { position: [0.85, -1.95, -0.9], radius: 0.18, speed: 1.7 },
];

// Surface ripple: how far the noise pushes the surface (relative to radius)
// and how fast it flows.
export const RIPPLE = { amplitude: 0.42, detail: 0.1, speed: 0.55 } as const;

// Furthest a droplet reaches sideways from the garment (|x| + radius).
export const CLUSTER_EXTENT = Math.max(
  ...BLOBS.map(({ position, radius }) => Math.abs(position[0]) + radius),
);
// World units kept free between the cluster and the column's inner edge.
export const COLUMN_MARGIN = 0.2;
// Must match the scene camera's fov.
export const FOV = 35;
// Cluster scale on phones, where the garment is centred and framed close.
export const PHONE_SCALE = 0.78;
// World units off the camera axis beyond which a garment is in a side column.
export const SIDE_COLUMN_OFFSET = 1;
