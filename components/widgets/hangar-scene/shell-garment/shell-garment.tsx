"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { type Group, type MeshStandardMaterial, SRGBColorSpace } from "three";

import { GARMENT_HEIGHT, SHELL_DEPTH } from "../constants";
import { useStopVisibility } from "../hooks/use-stop-visibility";
import { useTurn } from "../hooks/use-turn";
import type { GarmentFace } from "../types";
import type { ShellGarmentProps } from "./types";

// Grid density of each shell; enough vertices for a smooth bulge.
const SEGMENTS = 160;

function ShellGarment({
  model,
  position,
  index,
  stops,
  totalStops,
  progressRef,
  turnsRef,
  reducedMotion,
}: ShellGarmentProps) {
  const group = useRef<Group>(null);
  const front = useRef<MeshStandardMaterial>(null);
  const back = useRef<MeshStandardMaterial>(null);
  const faces = [model.front, model.back];
  const textures = useTexture(
    faces.flatMap((face) => [face.src, face.depth, face.normal]),
  );

  // Only the colour maps are sRGB; depth and normals are data.
  useLayoutEffect(() => {
    [textures[0], textures[3]].forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
    });
  }, [textures]);

  const visibility = useStopVisibility(stops, totalStops, progressRef, () =>
    [front.current, back.current].filter((m): m is MeshStandardMaterial => !!m),
  );
  const angle = useTurn({ turnsRef, index, visibility, reducedMotion });

  useFrame(() => {
    if (group.current) group.current.rotation.y = angle.current;
  });

  const shell = (face: GarmentFace, side: number) => {
    const [map, depth, normal] = textures.slice(side * 3, side * 3 + 3);
    return (
      <mesh
        key={face.src}
        // The back shell is the front turned around: it bulges toward -z and
        // shares the front's outline, so the two close at the rim.
        rotation={[0, side === 0 ? 0 : Math.PI, 0]}
      >
        <planeGeometry
          args={[
            GARMENT_HEIGHT * (face.width / face.height),
            GARMENT_HEIGHT,
            SEGMENTS,
            SEGMENTS,
          ]}
        />
        <meshStandardMaterial
          ref={side === 0 ? front : back}
          map={map}
          displacementMap={depth}
          displacementScale={SHELL_DEPTH}
          normalMap={normal}
          emissive="#ffffff"
          emissiveMap={map}
          emissiveIntensity={model.glow}
          alphaTest={0.5}
          transparent
          roughness={0.95}
          fog={false}
        />
      </mesh>
    );
  };

  return (
    <group position={position}>
      <group ref={group}>{faces.map(shell)}</group>
    </group>
  );
}

export default ShellGarment;
