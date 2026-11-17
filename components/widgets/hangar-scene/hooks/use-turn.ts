"use client";

/* eslint-disable react-hooks/immutability -- turn states are mutable animation
   state shared through a ref between the page and the canvas; they are only
   written in event handlers and frame callbacks, never during render. */

import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";

import type { TurnState } from "../types";

const IDLE_AFTER_MS = 2500;
const IDLE_SPEED = 0.3; // rad/s
const FRICTION = 3; // inertia decay per second

interface TurnOptions {
  turnsRef: RefObject<TurnState[]>;
  index: number;
  /** Clamp in radians; omit for a free 360° turn. */
  range?: number;
  /** 0–1 visibility of the garment; it rests at its front view while hidden. */
  visibility: RefObject<number>;
  reducedMotion: boolean;
}

// Scene-side turn: integrates release inertia and idle drift into the shared
// turn state (always relative, so nothing ever jumps), then eases a displayed
// angle toward it. Returns the displayed angle.
export function useTurn({
  turnsRef,
  index,
  range,
  visibility,
  reducedMotion,
}: TurnOptions) {
  const shown = useRef(0);
  const idleDirection = useRef(1);

  useFrame((_, delta) => {
    const turn = turnsRef.current?.[index];
    if (!turn) return;

    // Hidden garments stop drifting and settle on their rest view, so the
    // next piece always arrives showing its face, never its edge.
    if ((visibility.current ?? 0) < 0.01 && !turn.dragging) {
      const rest = Math.round(turn.angle / (Math.PI * 2)) * Math.PI * 2;
      turn.angle = range === undefined ? rest : 0;
      turn.velocity = 0;
      turn.lastInput = performance.now();
      shown.current = turn.angle;
      return;
    }

    if (!turn.dragging) {
      turn.angle += turn.velocity * delta;
      turn.velocity *= Math.exp(-FRICTION * delta);

      const resting = performance.now() - turn.lastInput > IDLE_AFTER_MS;
      if (resting && !reducedMotion && Math.abs(turn.velocity) < 0.05) {
        if (range === undefined) turn.angle += IDLE_SPEED * delta;
        else {
          // Ping-pong inside the footage's range.
          if (Math.abs(turn.angle) > range * 0.7)
            idleDirection.current = -Math.sign(turn.angle);
          turn.angle += idleDirection.current * IDLE_SPEED * 0.6 * delta;
        }
      }
    }

    if (range !== undefined) {
      // Soft stop at the edge of the footage instead of a hard wall.
      if (Math.abs(turn.angle) > range) {
        turn.angle = Math.sign(turn.angle) * range;
        turn.velocity = 0;
      }
    }

    shown.current += (turn.angle - shown.current) * (1 - Math.exp(-delta * 10));
  });

  return shown;
}
