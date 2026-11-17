// Seconds the weld takes when everything is already loaded (cache), so the
// repair still reads as a moment rather than a flash.
export const MIN_WELD_SECONDS = 1.6;
// Give up waiting on assets after this long and open anyway.
export const LOAD_TIMEOUT_MS = 15000;
// Sparks kept in the pool, and how often the laser throws one (ms).
export const SPARK_POOL = 28;
export const SPARK_EVERY_MS = 45;
// Laser emitter, off-screen top right, as fractions of the viewport.
export const EMITTER = { x: 1.08, y: -0.08 } as const;
