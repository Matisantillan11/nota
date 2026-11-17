"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";

import {
  TWO_COLUMN_MIN_WIDTH,
  getCameraStops,
  sampleCameraPath,
} from "../utils/camera-path";
import type { CameraRigProps } from "./types";

const DRIFT = 0.35;

function CameraRig({ pieceCount, progressRef, reducedMotion }: CameraRigProps) {
  const width = useThree(({ size }) => size.width);
  const height = useThree(({ size }) => size.height);
  const stops = useMemo(() => {
    // Match the CSS breakpoint, not the canvas width: the canvas excludes the
    // scrollbar, so it can sit just below the width the layout switched at.
    const columns = window.matchMedia(
      `(min-width: ${TWO_COLUMN_MIN_WIDTH}px)`,
    ).matches;
    return getCameraStops(pieceCount, { width, height, columns });
  }, [pieceCount, width, height]);
  const position = useRef(new Vector3(...stops[0].position));
  const target = useRef(new Vector3(...stops[0].target));
  const goal = useRef(new Vector3());

  useFrame(({ camera, pointer }, delta) => {
    const stop = sampleCameraPath(stops, progressRef.current ?? 0);
    // Pointer adds a little zero-g sway; reduced motion follows scroll only.
    const sway = reducedMotion ? 0 : DRIFT;
    goal.current.set(
      stop.position[0] + pointer.x * sway,
      stop.position[1] + pointer.y * sway * 0.6,
      stop.position[2],
    );

    // Frame-rate independent damping toward the sampled stop.
    // Tight follow: the camera tracks the snapped scroll almost frame for
    // frame; this only smooths pointer sway and wheel steps.
    const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * 14);
    position.current.lerp(goal.current, ease);
    target.current.lerp(goal.current.set(...stop.target), ease);

    camera.position.copy(position.current);
    camera.lookAt(target.current);
  });

  return null;
}

export default CameraRig;
