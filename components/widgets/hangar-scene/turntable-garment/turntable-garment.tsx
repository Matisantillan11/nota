"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { type MeshBasicMaterial, SRGBColorSpace } from "three";

import { GARMENT_HEIGHT } from "../constants";
import { useStopVisibility } from "../hooks/use-stop-visibility";
import { useTurn } from "../hooks/use-turn";
import { getTurntableFrame } from "../utils/turntable-frame";
import type { TurntableGarmentProps } from "./types";

function TurntableGarment({
  model,
  position,
  index,
  stops,
  totalStops,
  progressRef,
  turnsRef,
  reducedMotion,
}: TurntableGarmentProps) {
  const { atlas, range } = model;
  const material = useRef<MeshBasicMaterial>(null);
  const shown = useRef(-1);
  const map = useTexture(atlas.src, (texture) => {
    texture.colorSpace = SRGBColorSpace;
  });

  const visibility = useStopVisibility(stops, totalStops, progressRef, () =>
    material.current ? [material.current] : [],
  );
  const angle = useTurn({ turnsRef, index, range, visibility, reducedMotion });

  // Pick the footage frame for the current angle; only touch the texture
  // (through the material, which owns it once mounted) when the frame changes.
  useFrame(() => {
    const texture = material.current?.map;
    if (!texture) return;
    const frame = getTurntableFrame(
      angle.current,
      range,
      atlas.cols * atlas.rows,
    );
    const key = frame.index * (frame.mirrored ? -1 : 1);
    if (key === shown.current) return;
    shown.current = key;
    const col = frame.index % atlas.cols;
    const row = Math.floor(frame.index / atlas.cols);
    texture.repeat.set((frame.mirrored ? -1 : 1) / atlas.cols, 1 / atlas.rows);
    texture.offset.set(
      (col + (frame.mirrored ? 1 : 0)) / atlas.cols,
      1 - (row + 1) / atlas.rows,
    );
  });

  return (
    <mesh position={position}>
      <planeGeometry
        args={[
          GARMENT_HEIGHT * (atlas.cellWidth / atlas.cellHeight),
          GARMENT_HEIGHT,
        ]}
      />
      <meshBasicMaterial
        ref={material}
        map={map}
        transparent
        alphaTest={0.02}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  );
}

export default TurntableGarment;
