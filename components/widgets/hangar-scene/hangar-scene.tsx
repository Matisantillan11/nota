"use client";

import {
  Environment,
  Lightformer,
  PerformanceMonitor,
  Stars,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";

import CameraRig from "./camera-rig";
import DeconMist from "./decon-mist";
import {
  FOG,
  MAX_DPR,
  MIN_DPR,
  PIECE_SPACING,
  SCENE_BACKGROUND,
} from "./constants";
import Garment from "./garment";
import ShootingStars from "./shooting-stars";
import Sparkles from "./sparkles";
import type { HangarSceneProps } from "./types";

function HangarScene({
  garments,
  progressRef,
  turnsRef,
  revealed,
  reducedMotion,
  label,
}: HangarSceneProps) {
  // Stops: the hatch, one per garment, deep space. The lead garment is the
  // one floating in the hero, so it owns the first two stops.
  const totalStops = garments.length + 2;
  const [dpr, setDpr] = useState(MAX_DPR);

  return (
    <Canvas
      role="img"
      aria-label={label}
      dpr={dpr}
      camera={{ fov: 35, near: 0.1, far: 300, position: [0, 0, 12] }}
      eventSource={typeof document === "undefined" ? undefined : document.body}
      eventPrefix="client"
      // Swaps between garment states clip each layer along a scan line.
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
      fallback={
        <p className="grid size-full place-items-center px-6 text-center text-sm text-muted-foreground">
          Tu navegador no puede mostrar las prendas en 3D.
        </p>
      }
    >
      {/* Weaker devices: render fewer pixels instead of dropping frames. */}
      <PerformanceMonitor
        onDecline={() => setDpr(MIN_DPR)}
        onIncline={() => setDpr(MAX_DPR)}
      />
      <color attach="background" args={[SCENE_BACKGROUND]} />
      <fog attach="fog" args={[SCENE_BACKGROUND, FOG.near, FOG.far]} />

      {/* Studio light for the garments, all neutral (no colour on fabric). */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 4, 6]} intensity={2.2} />
      {/* Back light rims the garments so black fabric separates from the void. */}
      <directionalLight position={[3, 3, -6]} intensity={2} />
      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={2}
          position={[0, 4, 5]}
          scale={[8, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[-5, 0, 2]}
          scale={[2, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[5, 1, -4]}
          scale={[2, 8, 1]}
        />
      </Environment>

      {/* Two star layers at different depths give parallax as the camera flies. */}
      <Stars
        radius={40}
        depth={50}
        count={reducedMotion ? 2500 : 5000}
        factor={5}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.6}
      />
      <Stars
        radius={110}
        depth={60}
        count={reducedMotion ? 1500 : 3000}
        factor={8}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.3}
      />

      <ShootingStars reducedMotion={reducedMotion} />
      <Sparkles reducedMotion={reducedMotion} />

      <Suspense fallback={null}>
        {garments.map((model, i) => (
          <Garment
            key={i}
            model={model}
            index={i}
            position={[0, 0, -i * PIECE_SPACING]}
            stops={i === 0 ? [0, 1] : [i + 1]}
            totalStops={totalStops}
            progressRef={progressRef}
            turnsRef={turnsRef}
            revealed={revealed}
            reducedMotion={reducedMotion}
          />
        ))}
      </Suspense>

      <DeconMist revealed={revealed} reducedMotion={reducedMotion} />

      <CameraRig
        pieceCount={garments.length}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}

export default HangarScene;
