"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type ShaderMaterial,
  Vector3,
} from "three";

import {
  MAX_SPARKLES_PER_FRAME,
  SPARKLE_DEPTH,
  SPARKLE_FRAGMENT,
  SPARKLE_LIFE,
  SPARKLE_POOL,
  SPARKLE_VERTEX,
  SPARKLES_PER_UNIT,
} from "./constants";
import type { SparklesProps } from "./types";

const random = (min: number, max: number) => min + Math.random() * (max - min);

// Star sparkles that appear only while the camera travels between sections,
// in proportion to how far it moved, then twinkle out.
function Sparkles({ reducedMotion, color }: SparklesProps) {
  const material = useRef<ShaderMaterial>(null);
  const last = useRef<Vector3 | null>(null);
  const carry = useRef(0);
  const cursor = useRef(0);
  const scratch = useMemo(
    () => ({ forward: new Vector3(), right: new Vector3(), up: new Vector3() }),
    [],
  );

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(SPARKLE_POOL * 3), 3),
    );
    // Born long ago => invisible until emitted.
    g.setAttribute(
      "aBirth",
      new BufferAttribute(new Float32Array(SPARKLE_POOL).fill(-100), 1),
    );
    g.setAttribute(
      "aLife",
      new BufferAttribute(new Float32Array(SPARKLE_POOL).fill(1), 1),
    );
    g.setAttribute(
      "aSize",
      new BufferAttribute(new Float32Array(SPARKLE_POOL), 1),
    );
    return g;
  }, []);

  useFrame(({ camera, clock, size }) => {
    const time = clock.elapsedTime;
    if (material.current) material.current.uniforms.uTime.value = time;
    if (reducedMotion) return;

    if (!last.current) {
      last.current = camera.position.clone();
      return;
    }
    const travelled = camera.position.distanceTo(last.current);
    last.current.copy(camera.position);

    carry.current += travelled * SPARKLES_PER_UNIT;
    let count = Math.min(Math.floor(carry.current), MAX_SPARKLES_PER_FRAME);
    carry.current -= count;
    if (count <= 0) return;

    const { forward, right, up } = scratch;
    camera.getWorldDirection(forward);
    right.crossVectors(forward, camera.up).normalize();
    up.crossVectors(right, forward).normalize();
    const aspect = size.width / size.height;
    const position = geometry.getAttribute("position") as BufferAttribute;
    const birth = geometry.getAttribute("aBirth") as BufferAttribute;
    const life = geometry.getAttribute("aLife") as BufferAttribute;
    const sizes = geometry.getAttribute("aSize") as BufferAttribute;

    while (count-- > 0) {
      const i = cursor.current;
      cursor.current = (cursor.current + 1) % SPARKLE_POOL;
      const depth = random(SPARKLE_DEPTH.min, SPARKLE_DEPTH.max);
      // Anywhere in view at that depth (fov 35 => half-height ≈ 0.32 × depth).
      const halfHeight = depth * 0.32;
      position.setXYZ(
        i,
        camera.position.x +
          forward.x * depth +
          right.x * random(-1, 1) * halfHeight * aspect +
          up.x * random(-1, 1) * halfHeight,
        camera.position.y +
          forward.y * depth +
          right.y * random(-1, 1) * halfHeight * aspect +
          up.y * random(-1, 1) * halfHeight,
        camera.position.z +
          forward.z * depth +
          right.z * random(-1, 1) * halfHeight * aspect +
          up.z * random(-1, 1) * halfHeight,
      );
      birth.setX(i, time);
      life.setX(i, random(SPARKLE_LIFE.min, SPARKLE_LIFE.max));
      sizes.setX(i, random(0.35, 0.9));
    }
    position.needsUpdate = true;
    birth.needsUpdate = true;
    life.needsUpdate = true;
    sizes.needsUpdate = true;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={SPARKLE_VERTEX}
        fragmentShader={SPARKLE_FRAGMENT}
        uniforms={{ uTime: { value: 0 }, uColor: { value: new Color(color) } }}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export default Sparkles;
