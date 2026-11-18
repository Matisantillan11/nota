"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, Color, type ShaderMaterial } from "three";

import { GARMENT_HEIGHT, HALO_SIZE } from "../../constants";
import { GLSL_NOISE } from "../../utils/glsl-noise";
import type { HaloProps } from "./types";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Backlit mist: a radial glow broken up by slowly drifting wisps.
const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  uniform float uTime;
  varying vec2 vUv;
  ${GLSL_NOISE}
  void main() {
    vec2 p = vUv - 0.5;
    float t = uTime;
    // Domain warp: the vapour curls on itself as it drifts.
    vec2 warp = vec2(
      fbm(p * 1.4 + vec2(t * 0.09, -t * 0.06)),
      fbm(p * 1.4 + vec2(-t * 0.07, t * 0.1) + 5.2)
    ) - 0.5;
    // An uneven, breathing outline instead of a disc.
    float r = length(p + warp * 0.42) * 2.0;
    float glow = pow(clamp(1.0 - r, 0.0, 1.0), 2.2);
    // Two vapour layers moving in different directions, through the warp.
    float drift = fbm(p * 1.8 + warp * 1.5 + vec2(t * 0.11, t * 0.08));
    float wisps = fbm(p * 2.8 + drift * 1.4 - vec2(t * 0.05, t * 0.16));
    // Wide ramp keeps it soft and out of focus.
    float mist = smoothstep(0.2, 1.0, wisps);
    float light = glow * (0.5 + 0.8 * mist);
    // Never reach the quad's edge.
    light *= 1.0 - smoothstep(0.38, 0.5, length(p));
    gl_FragColor = vec4(uColor * light * uStrength, 1.0);
  }
`;

// Backlit mist behind a garment, like the decontamination fog of an airlock:
// it separates dark fabric from the void. Sits behind the garment and
// doesn't turn with it.
function Halo({ strength, visibility, color, still }: HaloProps) {
  const material = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!material.current) return;
    if (!still) material.current.uniforms.uTime.value = clock.elapsedTime;
    (material.current.uniforms.uColor.value as Color).set(color);
    const shown = (visibility.current ?? 0) * strength;
    material.current.uniforms.uStrength.value = shown;
    material.current.visible = shown > 0.005;
  });

  const size = GARMENT_HEIGHT * HALO_SIZE;
  return (
    <mesh position={[0, 0, -1.2]} renderOrder={-1}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={{
          uColor: { value: new Color(color) },
          uStrength: { value: 0 },
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

export default Halo;
