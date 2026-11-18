"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { type Group, MeshPhysicalMaterial, Vector3 } from "three";

import { GLSL_SIMPLEX_3D } from "../../utils/glsl-noise";
import { TWO_COLUMN_MAX_WIDTH } from "../../utils/camera-path";
import { BLOBS, CLUSTER_EXTENT, COLUMN_MARGIN, FOV, RIPPLE } from "./constants";
import type { LiquidBlobsProps } from "./types";

// Mirror chrome whose surface ripples like mercury. The vertex shader
// displaces a sphere with moving simplex noise and rebuilds the normal from
// the displaced neighbours, so reflections follow the wobble.
// One clock for every droplet: a shared uniform, updated once per frame.
const LIQUID_TIME = { value: 0 };

function createLiquidMetal(seed: number) {
  const material = new MeshPhysicalMaterial({
    color: "#e8ebf0",
    metalness: 1,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 2.2,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = LIQUID_TIME;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform float uTime;
         ${GLSL_SIMPLEX_3D}
         float liquid(vec3 p) {
           // Low frequency, two broad swells: smooth mercury, not crumpled foil.
           return snoise(p * 0.85 + vec3(${seed.toFixed(1)}, uTime * ${RIPPLE.speed.toFixed(2)}, uTime * ${(RIPPLE.speed * 0.7).toFixed(2)})) * ${RIPPLE.amplitude.toFixed(2)}
             + snoise(p * 1.5 + vec3(uTime * ${(RIPPLE.speed * 0.6).toFixed(2)}, ${seed.toFixed(1)}, 0.0)) * ${RIPPLE.detail.toFixed(2)};
         }
         vec3 liquidAt(vec3 p) {
           vec3 n = normalize(p);
           return p + n * liquid(p);
         }`,
      )
      .replace(
        "#include <beginnormal_vertex>",
        `vec3 objectNormal;
         {
           vec3 n = normalize(position);
           vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
           vec3 b = cross(n, t);
           float e = 0.06;
           vec3 p0 = liquidAt(position);
           vec3 p1 = liquidAt(position + t * e);
           vec3 p2 = liquidAt(position + b * e);
           objectNormal = normalize(cross(p1 - p0, p2 - p0));
           if (dot(objectNormal, n) < 0.0) objectNormal = -objectNormal;
         }
         #ifdef USE_TANGENT
           vec3 objectTangent = vec3(tangent.xyz);
         #endif`,
      )
      .replace(
        "#include <begin_vertex>",
        "vec3 transformed = liquidAt(position);",
      );
  };
  material.customProgramCacheKey = () => `liquid-metal-${seed}`;
  return material;
}

function LiquidBlobs({ visibility, still }: LiquidBlobsProps) {
  const group = useRef<Group>(null);
  const slots = useRef<(Group | null)[]>([]);
  const origin = useMemo(() => new Vector3(), []);
  const materials = useMemo(
    () => BLOBS.map((_, i) => createLiquidMetal(i * 7.3 + 1)),
    [],
  );

  useFrame(({ camera, clock, size }) => {
    if (!still) LIQUID_TIME.value = clock.elapsedTime;
    const layer = group.current;
    if (!layer) return;
    // Droplets swell in with their garment and shrink away with it.
    const shown = visibility.current ?? 0;
    layer.visible = shown > 0.01;
    layer.scale.setScalar(Math.max(shown, 0.001));

    // Parallax compensation: a droplet set behind the garment would drift
    // toward the camera's axis (into the text column when the garment sits
    // in a side column). Place each one so it appears where it would at the
    // garment's own depth, keeping the cluster around the garment.
    layer.getWorldPosition(origin);
    const offset = origin.x - camera.position.x;
    const distance = Math.max(camera.position.z - origin.z, 1);

    // In a side column, squeeze the cluster to the column's width so no
    // droplet reaches the text; centred (phones) it keeps its full spread.
    let squeeze = 1;
    if (Math.abs(offset) > 0.1) {
      const visibleWidth =
        2 *
        distance *
        Math.tan((FOV / 2) * (Math.PI / 180)) *
        (size.width / size.height);
      const column =
        (visibleWidth * Math.min(size.width, TWO_COLUMN_MAX_WIDTH)) /
        size.width /
        2;
      squeeze = Math.min(1, (column / 2 - COLUMN_MARGIN) / CLUSTER_EXTENT);
    }

    BLOBS.forEach(({ position: [x, y, z] }, i) => {
      const slot = slots.current[i];
      if (!slot) return;
      const depth = 1 - z / distance;
      slot.position.set((x * squeeze + offset) * depth - offset, y * depth, z);
      slot.scale.setScalar(Math.max(squeeze, 0.55));
    });
  });

  return (
    <group ref={group}>
      {BLOBS.map(({ radius, speed }, i) => (
        <group
          key={i}
          ref={(slot) => {
            slots.current[i] = slot;
          }}
        >
          {still ? (
            <mesh scale={radius} material={materials[i]}>
              <icosahedronGeometry args={[1, 32]} />
            </mesh>
          ) : (
            <Float speed={speed} rotationIntensity={0.6} floatIntensity={0.8}>
              <mesh scale={radius} material={materials[i]}>
                <icosahedronGeometry args={[1, 32]} />
              </mesh>
            </Float>
          )}
        </group>
      ))}
    </group>
  );
}

export default LiquidBlobs;
