"use client";

import { useEffect, useRef, useState } from "react";

import { hasWebGL, useSceneProgress } from "~/components/widgets/hangar-scene";
import { MOTION_EASE, gsap, useGSAP } from "~/utils/motion";

import {
  EMITTER,
  LOAD_TIMEOUT_MS,
  MIN_WELD_SECONDS,
  SPARK_EVERY_MS,
  SPARK_POOL,
} from "./constants";
import type { LoadingGateProps } from "./types";

// The hatch, closed: a laser welds its seam shut while the garments load,
// then the doors part on the drop. The weld follows real load progress.
function LoadingGate({ reducedMotion, onOpen }: LoadingGateProps) {
  const root = useRef<HTMLDivElement>(null);
  const { progress, done } = useSceneProgress();
  const [timedOut, setTimedOut] = useState(false);
  const [gone, setGone] = useState(false);
  const weld = useRef({ p: 0 });
  const opened = useRef(false);
  const lastSpark = useRef(0);
  const nextSpark = useRef(0);

  useEffect(() => {
    const id = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, []);

  // Lock the page under the gate.
  useEffect(() => {
    if (gone) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [gone]);

  // Checked once: without WebGL nothing will ever load, so open at once.
  const [webgl] = useState(() =>
    typeof window === "undefined" ? true : hasWebGL(),
  );
  const ready = done || timedOut || !webgl;

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const q = gsap.utils.selector(scope);
      const [head] = q("[data-laser-head]");
      const [beam] = q("[data-laser-beam]");
      const [bead] = q("[data-weld]");
      const [percent] = q("[data-percent]");
      const sparks = q("[data-spark]");

      const paint = () => {
        const p = weld.current.p;
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const y = p * vh;
        gsap.set(head, { y });
        gsap.set(bead, { height: y });
        // Beam from the off-screen emitter to the head.
        const ex = EMITTER.x * vw;
        const ey = EMITTER.y * vh;
        const dx = vw / 2 - ex;
        const dy = y - ey;
        gsap.set(beam, {
          x: ex,
          y: ey,
          width: Math.hypot(dx, dy),
          rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
        });
        if (percent) percent.textContent = `${Math.round(p * 100)}%`;

        // Throw a spark from the head every few ms while welding.
        const now = performance.now();
        if (now - lastSpark.current > SPARK_EVERY_MS && p < 1) {
          lastSpark.current = now;
          const spark = sparks[nextSpark.current];
          nextSpark.current = (nextSpark.current + 1) % sparks.length;
          const side = Math.random() < 0.5 ? -1 : 1;
          gsap.killTweensOf(spark);
          gsap.set(spark, { x: vw / 2, y, opacity: 1, scale: 1 });
          gsap.to(spark, {
            x: vw / 2 + side * gsap.utils.random(20, 90),
            duration: gsap.utils.random(0.35, 0.7),
            ease: "power2.out",
          });
          gsap.to(spark, {
            y: y + gsap.utils.random(30, 120),
            opacity: 0,
            scale: 0.4,
            duration: gsap.utils.random(0.35, 0.7),
            ease: "power2.in",
          });
        }
      };

      const open = () => {
        if (opened.current) return;
        opened.current = true;
        onOpen();
        const timeline = gsap.timeline({ onComplete: () => setGone(true) });
        if (reducedMotion) {
          timeline.to(scope, { autoAlpha: 0, duration: 0.3 });
          return;
        }
        timeline
          // The finished seam flares once, then the laser shuts off.
          .to(q("[data-laser]"), { autoAlpha: 0, duration: 0.2 })
          .to(
            bead,
            { opacity: 1, filter: "brightness(2)", duration: 0.15 },
            "<",
          )
          .to(bead, { opacity: 0.6, filter: "brightness(1)", duration: 0.5 })
          .to(q("[data-status]"), { autoAlpha: 0, duration: 0.3 }, "<")
          // Doors part on the drop.
          .to(
            q("[data-door]"),
            {
              xPercent: (i) => (i === 0 ? -100 : 100),
              duration: 1.2,
              ease: MOTION_EASE.inOut,
            },
            "-=0.2",
          );
      };

      if (reducedMotion) {
        if (ready) open();
        return;
      }

      // Weld toward real progress (kept just short of the end until done),
      // never faster than MIN_WELD_SECONDS for the whole seam.
      const target = ready ? 1 : Math.min(progress, 0.95);
      const remaining = Math.max(target - weld.current.p, 0);
      gsap.to(weld.current, {
        p: target,
        duration: Math.max(remaining * MIN_WELD_SECONDS, ready ? 0.3 : 0.5),
        ease: "none",
        overwrite: true,
        onUpdate: paint,
        onComplete: ready ? open : undefined,
      });
      paint();
    },
    { scope: root, dependencies: [progress, ready, reducedMotion] },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label="Cargando la tienda"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Doors. The seam and the weld bead live on the left door's edge, so
          when the doors part the finished weld leaves with that door. */}
      {[0, 1].map((side) => (
        <div
          key={side}
          data-door
          aria-hidden="true"
          className={
            side === 0
              ? "absolute inset-y-0 left-0 w-1/2 bg-card"
              : "absolute inset-y-0 right-0 w-1/2 bg-card"
          }
        >
          <div className="absolute inset-6 border border-foreground/10 md:inset-10" />
          {side === 0 && (
            <>
              <div className="absolute inset-y-0 right-0 w-px translate-x-1/2 bg-foreground/15" />
              <div
                data-weld
                className="absolute right-0 top-0 h-0 w-[2px] translate-x-1/2 opacity-80"
                style={{
                  background:
                    "linear-gradient(to top, #ffffff 0, var(--color-signal) 10px, rgb(30 144 255 / 0.45) 70px, rgb(242 242 242 / 0.3) 180px)",
                }}
              />
            </>
          )}
        </div>
      ))}

      {/* Laser: beam from off-screen, white-hot head, sparks */}
      <div
        data-laser
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          data-laser-beam
          className="absolute left-0 top-0 h-px origin-left"
          style={{
            background:
              "linear-gradient(to right, rgb(30 144 255 / 0) 0%, rgb(30 144 255 / 0.55) 70%, #ffffff 100%)",
          }}
        />
        <div
          data-laser-head
          className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            boxShadow:
              "0 0 6px 2px #ffffff, 0 0 18px 6px var(--color-signal), 0 0 42px 14px rgb(30 144 255 / 0.35)",
          }}
        />
        {Array.from({ length: SPARK_POOL }, (_, i) => (
          <span
            key={i}
            data-spark
            className="absolute left-0 top-0 size-[3px] rounded-full bg-white opacity-0"
            style={{ boxShadow: "0 0 4px 1px var(--color-signal)" }}
          />
        ))}
      </div>

      {/* Status */}
      <div
        data-status
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-center"
      >
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Reparando la compuerta.
        </span>
        <span data-percent className="text-sm tabular-nums text-foreground">
          0%
        </span>
      </div>
    </div>
  );
}

export default LoadingGate;
