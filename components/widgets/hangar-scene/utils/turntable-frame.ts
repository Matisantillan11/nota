// The footage runs from a three-quarter view (frame 0) to the straight back
// view (last frame), which is the rest pose at angle 0. Turning the other way
// replays it mirrored: the garment is symmetric.
export function getTurntableFrame(
  angle: number,
  range: number,
  frames: number,
): { index: number; mirrored: boolean } {
  const amount = Math.min(Math.abs(angle) / range, 1);
  return {
    index: Math.round((1 - amount) * (frames - 1)),
    mirrored: angle > 0,
  };
}
