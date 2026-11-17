import { describe, expect, it } from "vitest";
import { getTurntableFrame } from "./turntable-frame";

describe("getTurntableFrame", () => {
  it("rests on the last frame (straight back view) at angle 0", () => {
    expect(getTurntableFrame(0, 1, 16)).toEqual({ index: 15, mirrored: false });
  });

  it("reaches the first frame at the edge of the range, clamped beyond it", () => {
    expect(getTurntableFrame(-1, 1, 16)).toEqual({ index: 0, mirrored: false });
    expect(getTurntableFrame(-3, 1, 16)).toEqual({ index: 0, mirrored: false });
  });

  it("mirrors the footage when turning the other way", () => {
    expect(getTurntableFrame(1, 1, 16)).toEqual({ index: 0, mirrored: true });
    expect(getTurntableFrame(0.5, 1, 16).mirrored).toBe(true);
  });
});
