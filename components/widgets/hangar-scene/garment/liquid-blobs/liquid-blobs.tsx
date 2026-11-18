"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { type Group, MeshPhysicalMaterial } from "three";

import { GLSL_SIMPLEX_3D } from "../../utils/glsl-noise";
import { BLOBS } from "./constants";
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
    envMapIntensity: 1.6,
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
           return snoise(p * 0.85 + vec3(${seed.toFixed(1)}, uTime * 0.35, uTime * 0.25)) * 0.26
             + snoise(p * 1.4 + vec3(uTime * 0.2, ${seed.toFixed(1)}, 0.0)) * 0.06;
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
  const materials = useMemo(
    () => BLOBS.map((_, i) => createLiquidMetal(i * 7.3 + 1)),
    [],
  );

  useFrame(({ clock }) => {
    if (!still) LIQUID_TIME.value = clock.elapsedTime;
    // Droplets swell in with their garment and shrink away with it.
    const shown = visibility.current ?? 0;
    if (group.current) {
      group.current.visible = shown > 0.01;
      group.current.scale.setScalar(Math.max(shown, 0.001));
    }
  });

  return (
    <group ref={group}>
      {BLOBS.map(({ position, radius, speed }, i) =>
        still ? (
          <mesh
            key={i}
            position={position}
            scale={radius}
            material={materials[i]}
          >
            <icosahedronGeometry args={[1, 32]} />
          </mesh>
        ) : (
          <Float
            key={i}
            speed={speed}
            rotationIntensity={0.6}
            floatIntensity={0.8}
          >
            <mesh position={position} scale={radius} material={materials[i]}>
              <icosahedronGeometry args={[1, 32]} />
            </mesh>
          </Float>
        ),
      )}
    </group>
  );
}

export default LiquidBlobs;
