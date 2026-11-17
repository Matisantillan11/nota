"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, type Group, type ShaderMaterial } from "three";

import { HALO_COLOR } from "../constants";
import { GLSL_NOISE } from "../utils/glsl-noise";
import { MIST_DELAY, MIST_DEPTH, MIST_SECONDS } from "./constants";
import type { DeconMistProps } from "./types";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Decontamination mist as a low veil: it rolls out along the floor from the
// door seam, spreads to the sides, lifts a little and clears.
const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;
  ${GLSL_NOISE}
  void main() {
    vec2 p = vUv - vec2(0.5, 0.0);
    p.x *= uAspect;
    // Out from the seam along the floor, fast then easing.
    float spread = mix(0.1, 1.2 * uAspect, 1.0 - pow(1.0 - min(uProgress * 1.4, 1.0), 3.0));
    float sides = 1.0 - smoothstep(spread * 0.5, spread, abs(p.x));
    // Low: dense at the floor, feathered out by a third of the screen,
    // lifting slightly as it clears.
    float lift = uProgress * 0.12;
    float height = 1.0 - smoothstep(0.0, 0.34 + lift, vUv.y);
    vec2 q = vec2(p.x * 1.2 + uTime * 0.05 * sign(p.x), vUv.y * 3.0 - uTime * 0.12);
    float wisps = fbm(q * 2.2 + fbm(q * 1.3) * 1.2);
    float density = height * sides * (0.45 + 0.75 * smoothstep(0.3, 0.9, wisps));
    float fade = smoothstep(0.0, 0.12, uProgress) * (1.0 - smoothstep(0.45, 1.0, uProgress));
    gl_FragColor = vec4(uColor, density * fade * 0.3);
  }
`;

// A one-off burst of mist across the screen as the hatch opens. Rides with
// the camera, in front of everything, and is gone after MIST_SECONDS.
function DeconMist({ revealed, reducedMotion }: DeconMistProps) {
  const group = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);
  const start = useRef<number | null>(null);

  useFrame(({ camera, clock, size }) => {
    const layer = group.current;
    const shader = material.current;
    if (!layer || !shader) return;
    if (!revealed || reducedMotion) {
      layer.visible = false;
      return;
    }
    start.current ??= clock.elapsedTime + MIST_DELAY;
    const progress = (clock.elapsedTime - start.current) / MIST_SECONDS;
    layer.visible = progress >= 0 && progress <= 1;
    if (!layer.visible) return;

    layer.position.copy(camera.position);
    layer.quaternion.copy(camera.quaternion);
    // Fill the view at MIST_DEPTH (fov 35).
    const height = 2 * MIST_DEPTH * Math.tan((17.5 * Math.PI) / 180);
    const aspect = size.width / size.height;
    layer.scale.set(height * aspect, height, 1);
    shader.uniforms.uProgress.value = progress;
    shader.uniforms.uTime.value = clock.elapsedTime;
    shader.uniforms.uAspect.value = aspect;
  });

  return (
    <group ref={group} visible={false}>
      <mesh position={[0, 0, -MIST_DEPTH]} renderOrder={20}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={material}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={{
            uColor: { value: new Color(HALO_COLOR) },
            uProgress: { value: 0 },
            uTime: { value: 0 },
            uAspect: { value: 1 },
          }}
          transparent
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default DeconMist;
