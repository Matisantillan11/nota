"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import CameraRig from "./camera-rig";
import { FOG, MAX_DPR, PIECE_SPACING, SCENE_BACKGROUND } from "./constants";
import Garment from "./garment";
import Poster from "./poster";
import ShootingStars from "./shooting-stars";
import Sparkles from "./sparkles";
import type { HangarSceneProps } from "./types";

function HangarScene({
  garments,
  progressRef,
  turnsRef,
  reducedMotion,
  label,
}: HangarSceneProps) {
  // Stops: the hatch, one per garment, deep space. The lead garment is the
  // one floating in the hatch, so it owns the first two stops.
  const totalStops = garments.length + 2;

  return (
    <Canvas
      role="img"
      aria-label={label}
      dpr={[1, MAX_DPR]}
      camera={{ fov: 35, near: 0.1, far: 300, position: [0, 0, 12] }}
      eventSource={typeof document === "undefined" ? undefined : document.body}
      eventPrefix="client"
      fallback={
        <div className="grid size-full place-items-center pb-[30svh]">
          <Poster model={garments[0]} label={label} className="w-48 md:w-64" />
        </div>
      }
    >
      <color attach="background" args={[SCENE_BACKGROUND]} />
      <fog attach="fog" args={[SCENE_BACKGROUND, FOG.near, FOG.far]} />

      {/* Soft key from the front so the shells' relief reads as they turn. */}
      <ambientLight intensity={1.25} />
      <directionalLight position={[-3, 4, 6]} intensity={1.1} />
      {/* Neutral back light: rims the garments so black fabric separates from
          the void without adding a colour. */}
      <directionalLight position={[3, 3, -6]} intensity={2.2} />

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
            key={`${model}-${i}`}
            model={model}
            index={i}
            position={[0, 0, -i * PIECE_SPACING]}
            stops={i === 0 ? [0, 1] : [i + 1]}
            totalStops={totalStops}
            progressRef={progressRef}
            turnsRef={turnsRef}
            reducedMotion={reducedMotion}
          />
        ))}
      </Suspense>

      <CameraRig
        pieceCount={garments.length}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}

export default HangarScene;
