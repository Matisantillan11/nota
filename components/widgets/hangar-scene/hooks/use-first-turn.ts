"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";

import { LIGHTS_ON_AFTER } from "../constants";
import type { TurnState } from "../types";

interface FirstTurnOptions {
  turnsRef: RefObject<TurnState[]>;
  index: number;
  /** Run only while this is true (revealed, on screen, not yet completed). */
  active: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
}

// Counts a garment's first full revolution (its regular turn, or the
// visitor's hand — dragging counts too), then calls onComplete once.
export function useFirstTurn({
  turnsRef,
  index,
  active,
  reducedMotion,
  onComplete,
}: FirstTurnOptions) {
  const spun = useRef(0);
  const last = useRef<number | null>(null);
  const done = useRef(false);

  useFrame(() => {
    const turn = turnsRef.current?.[index];
    if (!active || done.current || !turn) return;

    if (reducedMotion) {
      done.current = true;
      onComplete();
      return;
    }

    if (last.current !== null)
      spun.current += Math.abs(turn.angle - last.current);
    last.current = turn.angle;

    if (spun.current >= LIGHTS_ON_AFTER) {
      done.current = true;
      onComplete();
    }
  });
}
