"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { CartProvider } from "~/app/_contexts/cart";
import {
  type TurnState,
  createTurnState,
} from "~/components/widgets/hangar-scene";
import { useReducedMotion } from "~/hooks/use-reduced-motion";
import { Observer, ScrollTrigger, gsap, useGSAP } from "~/utils/motion";

import DropHero from "../drop-hero";
import LoadingGate from "../loading-gate";
import NextDrop from "../next-drop";
import PieceSection from "../piece-section";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";
import UsageHint from "../usage-hint";
import type { HomeExperienceProps } from "./types";

// WebGL is client-only; the loading gate covers the page while it loads.
const HangarScene = dynamic(() => import("~/components/widgets/hangar-scene"), {
  ssr: false,
});

function HomeExperience({ drop, nextDrop }: HomeExperienceProps) {
  const main = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const hint = useRef<HTMLParagraphElement>(null);
  // Input is held until the loading gate opens.
  const open = useRef(false);
  // Tells the scene the visitor can see it (the hoodie's first turn waits).
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion();
  // Chosen colourway per piece; it also decides which model the scene shows.
  const [variants, setVariants] = useState<Record<string, string>>(() =>
    Object.fromEntries(drop.pieces.map((p) => [p.id, p.variants[0].id])),
  );
  const chooseVariant = (pieceId: string) => (variantId: string) =>
    setVariants((current) => ({ ...current, [pieceId]: variantId }));
  const models = drop.pieces.map(
    (piece) =>
      (
        piece.variants.find((v) => v.id === variants[piece.id]) ??
        piece.variants[0]
      ).model,
  );
  const turns = useRef<TurnState[]>(drop.pieces.map(createTurnState));
  // Sections: hatch, one per piece, next drop — one camera stop each.
  const lastStop = drop.pieces.length + 1;

  useGSAP(
    () => {
      // The camera is tied to the page scroll, so a garment and its
      // information always arrive together.
      const trigger = ScrollTrigger.create({
        trigger: main.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress: value }) => {
          // Reduced motion: cut between sections instead of flying.
          progress.current = reducedMotion
            ? Math.round(value * lastStop) / lastStop
            : value;
          // The instructions only apply while a garment is on screen.
          if (hint.current)
            hint.current.style.opacity =
              value * lastStop > lastStop - 0.5 ? "0" : "1";
        },
      });

      // Section-by-section navigation: every gesture moves exactly one
      // section, starting immediately, and gestures during a move are
      // ignored. The last "section" is the end of the page (the footer).
      const sections = Array.from(
        main.current?.querySelectorAll<HTMLElement>("[data-stop]") ?? [],
      );
      const targetOf = (index: number) =>
        index < sections.length
          ? sections[index].offsetTop
          : document.documentElement.scrollHeight - window.innerHeight;
      let index = Math.round(window.scrollY / window.innerHeight);
      let moving = false;

      const goTo = (next: number) => {
        const clamped = Math.min(Math.max(next, 0), sections.length);
        if (!open.current || moving || clamped === index) return;
        moving = true;
        index = clamped;
        gsap.to(window, {
          scrollTo: { y: targetOf(clamped), autoKill: false },
          duration: reducedMotion ? 0 : 0.5,
          ease: "power2.inOut",
          overwrite: true,
          onComplete: () => {
            moving = false;
          },
        });
      };

      // Leave scrolling and keys alone inside the cart and form fields.
      const ignore = (target: EventTarget | null) =>
        target instanceof Element &&
        !!target.closest('[role="dialog"], input, textarea, select');

      // One gesture, one section: only the first event of a gesture counts.
      // Trackpads keep sending momentum events after the finger lifts; any
      // event arriving within GESTURE_GAP of the previous one belongs to the
      // same gesture and is ignored, so nothing moves after the user stops.
      const GESTURE_GAP = 200;
      let lastEventAt = 0;
      const observer = Observer.create({
        target: window,
        type: "wheel,touch",
        wheelSpeed: -1,
        tolerance: 4,
        preventDefault: true,
        onChange: (self) => {
          const now = performance.now();
          const fresh = now - lastEventAt > GESTURE_GAP;
          lastEventAt = now;
          if (!fresh || moving || ignore(self.event.target)) return;
          // wheelSpeed -1 makes wheel-down and finger-up both negative.
          if (self.deltaY < 0) goTo(index + 1);
          else if (self.deltaY > 0) goTo(index - 1);
        },
      });

      const onKey = (event: KeyboardEvent) => {
        if (ignore(event.target)) return;
        const next = ["ArrowDown", "PageDown", " "].includes(event.key)
          ? 1
          : ["ArrowUp", "PageUp"].includes(event.key)
            ? -1
            : 0;
        if (!next) return;
        event.preventDefault();
        goTo(index + next);
      };
      window.addEventListener("keydown", onKey);

      return () => {
        trigger.kill();
        observer.kill();
        window.removeEventListener("keydown", onKey);
      };
    },
    { scope: main, dependencies: [reducedMotion, lastStop] },
  );

  return (
    <CartProvider>
      <div className="fixed inset-0 z-0">
        <HangarScene
          garments={models}
          progressRef={progress}
          turnsRef={turns}
          revealed={revealed}
          reducedMotion={reducedMotion}
          label={`${drop.pieces.map((piece) => piece.name).join(" y ")} flotando en el espacio.`}
        />
      </div>
      <LoadingGate
        reducedMotion={reducedMotion}
        onOpen={() => {
          open.current = true;
          setRevealed(true);
        }}
      />
      <SiteHeader />
      <UsageHint ref={hint} />
      <main ref={main} className="relative z-10">
        <DropHero
          drop={drop}
          variantId={variants[drop.pieces[0].id]}
          onVariantChange={chooseVariant(drop.pieces[0].id)}
          turnsRef={turns}
        />
        {drop.pieces.map((piece, i) => (
          <PieceSection
            key={piece.id}
            piece={piece}
            variantId={variants[piece.id]}
            onVariantChange={chooseVariant(piece.id)}
            turnsRef={turns}
            index={i}
            stop={i + 1}
          />
        ))}
        <NextDrop
          number={nextDrop.number}
          message={nextDrop.message}
          stop={lastStop}
        />
      </main>
      <SiteFooter />
    </CartProvider>
  );
}

export default HomeExperience;
