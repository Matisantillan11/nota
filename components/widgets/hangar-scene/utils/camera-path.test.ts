import { describe, expect, it } from "vitest";
import { getCameraStops, sampleCameraPath } from "./camera-path";

const desktop = { width: 1440, height: 900, columns: true };
const tablet = { width: 753, height: 1024, columns: true };
const phone = { width: 390, height: 844, columns: false };

describe("camera path", () => {
  it("has one stop per section: hatch, each garment, deep space", () => {
    expect(getCameraStops(2, desktop)).toHaveLength(4);
  });

  it("lands exactly on each stop at its share of the progress", () => {
    const stops = getCameraStops(2, desktop);
    expect(sampleCameraPath(stops, 0)).toEqual(stops[0]);
    expect(sampleCameraPath(stops, 1 / 3).position[2]).toBeCloseTo(
      stops[1].position[2],
    );
    expect(sampleCameraPath(stops, 1)).toEqual(stops[3]);
  });

  it("clamps progress outside 0..1", () => {
    const stops = getCameraStops(1, phone);
    expect(sampleCameraPath(stops, -2)).toEqual(stops[0]);
    expect(sampleCameraPath(stops, 5)).toEqual(stops[stops.length - 1]);
  });

  it("centres garments on phones and alternates columns from tablet up", () => {
    expect(getCameraStops(3, phone)[1].target[0]).toBe(0);
    for (const viewport of [tablet, desktop]) {
      const [, first, second, third] = getCameraStops(3, viewport);
      // Camera shifted right => garment appears left of centre.
      expect(first.target[0]).toBeGreaterThan(0);
      expect(second.target[0]).toBeLessThan(0);
      expect(third.target[0]).toBe(first.target[0]);
    }
  });
});
