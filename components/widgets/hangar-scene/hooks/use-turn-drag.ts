"use client";

/* eslint-disable react-hooks/immutability -- turn states are mutable animation
   state shared through a ref between the page and the canvas; they are only
   written in event handlers and frame callbacks, never during render. */

import { type RefObject, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { DRAG_SENSITIVITY } from "../constants";
import type { TurnState } from "../types";

export function createTurnState(): TurnState {
  return { angle: 0, velocity: 0, dragging: false, lastInput: 0 };
}

// DOM-side drag: any element the page marks as a garment's stage turns it.
// Horizontal moves only; vertical gestures stay with page scroll (pair with
// `touch-action: pan-y` on the element). State lives in a ref the scene reads.
export function useTurnDrag(turnsRef: RefObject<TurnState[]>, index: number) {
  const last = useRef({ x: 0, t: 0 });

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    const turn = turnsRef.current?.[index];
    if (!turn) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    turn.dragging = true;
    turn.velocity = 0;
    last.current = { x: event.clientX, t: performance.now() };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const turn = turnsRef.current?.[index];
    if (!turn?.dragging) return;
    const now = performance.now();
    const delta = (event.clientX - last.current.x) * DRAG_SENSITIVITY;
    const dt = Math.max((now - last.current.t) / 1000, 1 / 240);
    turn.angle += delta;
    // Smoothed release speed for the inertia that follows.
    turn.velocity = turn.velocity * 0.6 + (delta / dt) * 0.4;
    turn.lastInput = now;
    last.current = { x: event.clientX, t: now };
  }

  function onPointerUp() {
    const turn = turnsRef.current?.[index];
    if (!turn) return;
    turn.dragging = false;
    turn.lastInput = performance.now();
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };
}
