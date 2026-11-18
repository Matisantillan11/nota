"use client";

/* eslint-disable react-hooks/immutability -- the packing clock and the stack
   of garment heights are mutable animation state shared through refs; they
   are only written in effects and frame callbacks, never during render. */

import { Environment, Lightformer, Stars, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { Group, Material, Mesh } from "three";

import {
  BOX_MODELS,
  FOLDED_MODELS,
  LIGHT_COLORS,
  MAX_DPR,
  SCENE_BACKGROUND,
} from "../constants";
import Halo from "../garment/halo";
import {
  BOX_FLOOR,
  BOX_INNER,
  BOX_WIDTH,
  CAMERA,
  CLOSING,
  DROP_HEIGHT,
  PACKING,
} from "./constants";
import { useFittedModel } from "./fitted-model";
import { BOX_GEOMETRY, makeFlapsFoldable } from "./flaps";
import type { PackingSceneProps } from "./types";

useGLTF.preload(BOX_MODELS.open);
useGLTF.preload(BOX_MODELS.closed);
Object.values(FOLDED_MODELS).forEach((src) => useGLTF.preload(src));

const easeIn = (t: number) => t * t * t;
// Slow enough that a garment falling in stays readable.
const TURN_SPEED = 0.45;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
// Fit the box by width alone (generous depth keeps it from turning).
const BOX_FIT = { width: BOX_WIDTH, depth: BOX_WIDTH };

interface FoldedProps {
  src: string;
  footprint: { width: number; depth: number };
  index: number;
  /** Shared stack: each garment records its height so the next lands on it. */
  stack: { current: number[] };
  floor: number;
  startAt: number;
  turn: number;
  clock: { current: number };
  /** True once the box has closed: garments are inside, never drawn. */
  sealed: { current: boolean };
}

// One folded garment: waits, falls into the box, settles on the stack.
function Folded({
  src,
  footprint,
  index,
  stack,
  floor,
  startAt,
  turn,
  clock,
  sealed,
}: FoldedProps) {
  const { object, size } = useFittedModel(src, footprint);
  const group = useRef<Group>(null);

  useEffect(() => {
    stack.current[index] = size.y;
  }, [stack, index, size.y]);

  useFrame(() => {
    const node = group.current;
    if (!node) return;
    const t = clock.current - startAt;
    node.visible = t >= 0 && !sealed.current;
    if (!node.visible) return;
    const restY =
      floor + stack.current.slice(0, index).reduce((sum, h) => sum + h, 0);
    const fall = clamp01(t / PACKING.fall);
    const settle = clamp01((t - PACKING.fall) / PACKING.settle);
    // Falls with gravity, then a small rebound that eases out.
    const bounce = Math.sin(settle * Math.PI) * 0.06 * (1 - settle);
    node.position.y = restY + DROP_HEIGHT * (1 - easeIn(fall)) + bounce;
    node.rotation.y = turn * (1 - easeOut(fall));
    node.rotation.z = turn * 0.25 * (1 - easeOut(fall));
  });

  return <primitive ref={group} object={object} visible={false} />;
}

interface BoxContentsProps {
  garments: PackingSceneProps["garments"];
  reducedMotion: boolean;
  onPacked?: () => void;
}

function BoxContents({ garments, reducedMotion, onPacked }: BoxContentsProps) {
  const open = useFittedModel(BOX_MODELS.open, BOX_FIT);
  const closed = useFittedModel(BOX_MODELS.closed, BOX_FIT);
  const closedRef = useRef<Group>(null);
  const float = useRef<Group>(null);
  const clock = useRef(0);
  const packed = useRef(false);
  const stack = useRef<number[]>([]);
  const mist = useRef(1);
  const sealed = useRef(false);

  // Fit scale of the open box (model units -> world), and where its body
  // sits: the flaps make its bounding box wider and deeper than the body.
  const geometry = useMemo(() => {
    const { body } = BOX_GEOMETRY;
    const scale = open.size.x / BOX_GEOMETRY.modelWidth;
    return {
      bodyZ: ((body.minZ + body.maxZ) / 2) * scale,
      bodyWidth: (body.maxX - body.minX) * scale,
      bodyDepth: (body.maxZ - body.minZ) * scale,
      rim: (BOX_GEOMETRY.rimY - BOX_GEOMETRY.minY) * scale,
    };
  }, [open.size.x]);

  const flaps = useMemo(
    () => makeFlapsFoldable(open.object.children[0]),
    [open.object],
  );
  const closedMaterials = useMemo(() => {
    // Idempotent for the same reason as makeFlapsFoldable.
    if (closed.object.userData.fading)
      return closed.object.userData.fading as Material[];
    const list: Material[] = [];
    closed.object.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const material = (mesh.material as Material).clone();
      material.transparent = true;
      mesh.material = material;
      list.push(material);
    });
    closed.object.userData.fading = list;
    return list;
  }, [closed.object]);

  const footprint = useMemo(
    () => ({
      width: geometry.bodyWidth * BOX_INNER,
      depth: geometry.bodyDepth * BOX_INNER,
      // The whole stack fits below the rim, so nothing sticks out of the box.
      height:
        (geometry.rim * BOX_INNER - open.size.y * BOX_FLOOR) /
        Math.max(garments.length, 1),
    }),
    [
      geometry.bodyWidth,
      geometry.bodyDepth,
      geometry.rim,
      open.size.y,
      garments.length,
    ],
  );
  const floor = open.size.y * BOX_FLOOR;
  const closeAt =
    PACKING.firstDrop +
    Math.max(garments.length - 1, 0) * PACKING.gap +
    PACKING.fall +
    PACKING.settle +
    PACKING.closeAfter;
  const done = CLOSING.crossfade[1];

  useFrame(({ clock: three }, delta) => {
    clock.current = reducedMotion ? closeAt + done : clock.current + delta;
    const t = clock.current - closeAt;
    const phase = ([from, to]: readonly [number, number]) =>
      easeInOut(clamp01((t - from) / (to - from)));

    // Flaps fold one by one (sides, then back), like a real box.
    flaps.uniforms.uLeft.value = phase(CLOSING.left);
    flaps.uniforms.uRight.value = phase(CLOSING.right);
    flaps.uniforms.uBack.value = phase(CLOSING.back);

    // Then the folded box hands over to the closed model with a fade.
    const fade = phase(CLOSING.crossfade);
    sealed.current = fade > 0;
    flaps.materials.forEach((m) => (m.opacity = 1 - fade));
    closedMaterials.forEach((m) => (m.opacity = fade));
    open.object.visible = fade < 1;
    if (closedRef.current) closedRef.current.visible = fade > 0;

    if (!packed.current && t >= done) {
      packed.current = true;
      onPacked?.();
    }
    // The box floats in zero g and turns the whole time: garments drop in
    // and the flaps close while it turns.
    if (float.current && !reducedMotion) {
      float.current.position.y = Math.sin(three.elapsedTime * 0.9) * 0.08;
      float.current.rotation.y += delta * TURN_SPEED;
    }
  });

  return (
    <>
      {/* Pink mist behind the box, like behind the garments on the home
          page: outside the turning group, so it always faces the camera. */}
      <group position={[0, open.size.y * 0.5, -1.4]} scale={1.25}>
        <Halo
          strength={0.6}
          visibility={mist}
          color={LIGHT_COLORS.mist}
          still={reducedMotion}
        />
      </group>
      <group ref={float}>
        {/* Centre the box's body (not its flaps) on the turning axis. */}
        <group position={[0, 0, -geometry.bodyZ]}>
          <primitive object={open.object} />
          <group
            ref={closedRef}
            position={[0, 0, geometry.bodyZ]}
            scale={geometry.bodyWidth / closed.size.x}
            visible={false}
          >
            <primitive object={closed.object} />
          </group>
          <group position={[0, 0, geometry.bodyZ]}>
            {garments.map((model, i) => (
              <Folded
                key={`${model}-${i}`}
                src={FOLDED_MODELS[model]}
                footprint={footprint}
                index={i}
                stack={stack}
                floor={floor}
                startAt={PACKING.firstDrop + i * PACKING.gap}
                turn={(i % 2 === 0 ? 1 : -1) * 0.6}
                clock={clock}
                sealed={sealed}
              />
            ))}
          </group>
        </group>
      </group>
    </>
  );
}

function CameraFrame() {
  const camera = useThree((state) => state.camera);
  const wide = useThree((state) => state.size.width > state.size.height);
  useEffect(() => {
    camera.lookAt(0, wide ? CAMERA.targetY.wide : CAMERA.targetY.tall, 0);
  }, [camera, wide]);
  return null;
}

// The packing moment at checkout: an open box floats in space, each folded
// garment drops in, then the box closes.
function PackingScene({
  garments,
  reducedMotion,
  onPacked,
  label,
}: PackingSceneProps) {
  return (
    <Canvas
      role="img"
      aria-label={label}
      dpr={[1, MAX_DPR]}
      camera={{ fov: CAMERA.fov, position: CAMERA.position }}
      fallback={
        <p className="grid size-full place-items-center px-6 text-center text-sm text-muted-foreground">
          Tu navegador no puede mostrar el empaquetado en 3D.
        </p>
      }
    >
      <CameraFrame />
      <color attach="background" args={[SCENE_BACKGROUND]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-3, 5, 6]} intensity={2.2} />
      <directionalLight position={[3, 3, -5]} intensity={1.6} />
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
      </Environment>
      <Stars
        radius={40}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.4}
      />
      <Suspense fallback={null}>
        <BoxContents
          garments={garments}
          reducedMotion={reducedMotion}
          onPacked={onPacked}
        />
      </Suspense>
    </Canvas>
  );
}

export default PackingScene;
