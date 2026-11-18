"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import type { Material } from "three";

import { MIST_FADE, STOP_FADE } from "../constants";

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

// A garment is only visible near its own camera stops: the outgoing piece is
// gone before the incoming one appears, so two are never on screen at once.
export function useStopVisibility(
  stops: number[],
  totalStops: number,
  progressRef: RefObject<number>,
  materials: () => Material[],
) {
  const visibility = useRef(0);
  const mist = useRef(0);

  useFrame(() => {
    const at = (progressRef.current ?? 0) * (totalStops - 1);
    const distance = Math.min(...stops.map((stop) => Math.abs(at - stop)));
    visibility.current =
      1 - smoothstep(STOP_FADE.hold, STOP_FADE.gone, distance);
    mist.current = 1 - smoothstep(MIST_FADE.hold, MIST_FADE.gone, distance);
    for (const material of materials()) {
      material.opacity = visibility.current;
      material.visible = visibility.current > 0.01;
    }
  });

  return { visibility, mist };
}
