"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  AdditiveBlending,
  type Group,
  type Mesh,
  type ShaderMaterial,
} from "three";

import {
  BURST_GAP,
  BURST_STAGGER,
  MAX_STREAKS,
  STREAK_DEPTH,
  STREAK_FRAGMENT,
  STREAK_LENGTH,
  STREAK_LIFE,
  STREAK_SPEED,
  STREAK_VERTEX,
} from "./constants";
import type { ShootingStarsProps } from "./types";

const random = (min: number, max: number) => min + Math.random() * (max - min);

interface Streak {
  start: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
}

// A few shooting stars crossing the far background at random intervals.
// The group rides with the camera so they always cross what the visitor sees.
function ShootingStars({ reducedMotion }: ShootingStarsProps) {
  const group = useRef<Group>(null);
  const meshes = useRef<(Mesh | null)[]>([]);
  const streaks = useRef<(Streak | null)[]>(Array(MAX_STREAKS).fill(null));
  const nextBurst = useRef(random(2, 5));

  useFrame(({ camera, clock, size }) => {
    const time = clock.elapsedTime;
    if (!group.current) return;
    group.current.position.copy(camera.position);
    group.current.quaternion.copy(camera.quaternion);

    if (reducedMotion) {
      meshes.current.forEach((mesh) => mesh && (mesh.visible = false));
      return;
    }

    if (time >= nextBurst.current) {
      nextBurst.current = time + random(BURST_GAP.min, BURST_GAP.max);
      const count = 1 + Math.floor(Math.random() * MAX_STREAKS);
      // Visible half-extent at the streak depth (fov 35).
      const halfHeight = STREAK_DEPTH * 0.32;
      const halfWidth = halfHeight * (size.width / size.height);
      // One shared heading per appearance reads as a single event.
      const leftward = Math.random() < 0.5;
      const angle = random(0.25, 0.6);
      for (let i = 0; i < count; i++) {
        streaks.current[i] = {
          start: time + random(0, BURST_STAGGER),
          x: random(-halfWidth, halfWidth),
          y: random(halfHeight * 0.1, halfHeight * 0.9),
          dx: (leftward ? -1 : 1) * Math.cos(angle),
          dy: -Math.sin(angle),
          speed: random(STREAK_SPEED.min, STREAK_SPEED.max),
        };
      }
    }

    streaks.current.forEach((streak, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      const age = streak ? (time - streak.start) / STREAK_LIFE : -1;
      if (!streak || age < 0 || age > 1) {
        mesh.visible = false;
        if (age > 1) streaks.current[i] = null;
        return;
      }
      const travelled = streak.speed * STREAK_LIFE * age;
      mesh.visible = true;
      mesh.position.set(
        streak.x + streak.dx * travelled,
        streak.y + streak.dy * travelled,
        -STREAK_DEPTH,
      );
      // The plane's +x is the head: point it along the travel direction.
      mesh.rotation.z = Math.atan2(streak.dy, streak.dx);
      (mesh.material as ShaderMaterial).uniforms.uFade.value = Math.sin(
        age * Math.PI,
      );
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: MAX_STREAKS }, (_, i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            meshes.current[i] = mesh;
          }}
          visible={false}
          scale={[random(STREAK_LENGTH.min, STREAK_LENGTH.max), 1, 1]}
          frustumCulled={false}
        >
          <planeGeometry args={[1, 0.1]} />
          <shaderMaterial
            vertexShader={STREAK_VERTEX}
            fragmentShader={STREAK_FRAGMENT}
            uniforms={{ uFade: { value: 0 } }}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default ShootingStars;
