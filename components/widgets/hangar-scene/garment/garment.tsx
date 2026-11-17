"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import {
  AdditiveBlending,
  type Group,
  type Material,
  type Mesh,
  type MeshBasicMaterial,
} from "three";

import { GARMENT_HEIGHT, GARMENT_MODELS, SWAP_SECONDS } from "../constants";
import { useFirstTurn } from "../hooks/use-first-turn";
import { useStopVisibility } from "../hooks/use-stop-visibility";
import { useTurn } from "../hooks/use-turn";
import Halo from "./halo";
import ModelMesh from "./model-mesh";
import type { GarmentProps } from "./types";

// Fetch every model up front; the loading gate waits for them.
Object.values(GARMENT_MODELS).forEach(({ src, lit }) => {
  useGLTF.preload(src);
  if (lit) useGLTF.preload(lit);
});

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// The scan starts just below the hem and ends just above the hood.
const SCAN_FROM = -GARMENT_HEIGHT / 2 - 0.15;
const SCAN_TO = GARMENT_HEIGHT / 2 + 0.15;

function Garment({
  model,
  position,
  index,
  stops,
  totalStops,
  progressRef,
  turnsRef,
  revealed,
  reducedMotion,
}: GarmentProps) {
  const spin = useRef<Group>(null);
  const band = useRef<MeshBasicMaterial>(null);
  const bandMesh = useRef<Mesh>(null);
  const materials = useRef(new Set<Material>());
  const garment = GARMENT_MODELS[model];
  const [lit, setLit] = useState(false);
  const target = lit && garment.lit ? garment.lit : garment.src;

  // A swap keeps the outgoing state until the scan has passed over it.
  const [layers, setLayers] = useState<{
    current: string;
    previous: string | null;
    id: number;
  }>({ current: target, previous: null, id: 0 });
  if (layers.current !== target) {
    setLayers({ current: target, previous: layers.current, id: layers.id + 1 });
  }

  const cut = useRef(SCAN_FROM);
  const scan = useRef({ id: 0, progress: 1 });

  const visibility = useStopVisibility(stops, totalStops, progressRef, () => [
    ...materials.current,
  ]);
  const angle = useTurn({ turnsRef, index, visibility, reducedMotion });
  useFirstTurn({
    turnsRef,
    index,
    active: !!garment.lit && revealed && !lit,
    reducedMotion,
    onComplete: () => setLit(true),
  });

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y = angle.current;

    if (scan.current.id !== layers.id)
      scan.current = { id: layers.id, progress: 0 };
    const swapping = layers.previous !== null;
    if (swapping) {
      scan.current.progress = reducedMotion
        ? 1
        : Math.min(scan.current.progress + delta / SWAP_SECONDS, 1);
      cut.current =
        SCAN_FROM + (SCAN_TO - SCAN_FROM) * easeInOut(scan.current.progress);
      if (band.current) {
        band.current.opacity =
          Math.sin(scan.current.progress * Math.PI) * (visibility.current ?? 0);
      }
      if (scan.current.progress >= 1) {
        setLayers((state) => ({ ...state, previous: null }));
      }
    }
    if (bandMesh.current) {
      bandMesh.current.visible = swapping;
      bandMesh.current.position.y = cut.current;
    }
  });

  return (
    <group position={position}>
      <Halo
        strength={garment.halo}
        visibility={visibility}
        still={reducedMotion}
      />
      <group ref={spin}>
        <ModelMesh
          key={layers.current}
          src={layers.current}
          clip={layers.previous ? "below" : null}
          cutRef={cut}
          glow={layers.current === garment.lit ? garment.litGlow : 0}
          materialsRef={materials}
        />
        {layers.previous && (
          <ModelMesh
            key={layers.previous}
            src={layers.previous}
            clip="above"
            cutRef={cut}
            materialsRef={materials}
          />
        )}
      </group>
      {/* The scan line: a thin light that sweeps up across the garment. */}
      <mesh ref={bandMesh} visible={false} renderOrder={10}>
        <planeGeometry args={[GARMENT_HEIGHT * 0.8, 0.012]} />
        <meshBasicMaterial
          ref={band}
          color="#ffffff"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default Garment;
