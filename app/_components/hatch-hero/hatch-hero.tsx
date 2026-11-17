"use client";

import { useRef } from "react";

import { useTurnDrag } from "~/components/widgets/hangar-scene";
import { MOTION_DURATION, MOTION_EASE, gsap, useGSAP } from "~/utils/motion";

import PiecePurchase from "../piece-purchase";
import StarMark from "../star-mark";
import type { HatchHeroProps } from "./types";

function HatchHero({
  drop,
  reducedMotion,
  variantId,
  onVariantChange,
  turnsRef,
}: HatchHeroProps) {
  const drag = useTurnDrag(turnsRef, 0);
  const section = useRef<HTMLElement>(null);
  const hatch = useRef<HTMLDivElement>(null);
  const [lead] = drop.pieces;

  useGSAP(
    () => {
      const doors = gsap.utils.toArray<HTMLElement>("[data-door]");
      if (reducedMotion) {
        gsap.set(doors, { xPercent: (i) => (i === 0 ? -86 : 86) });
        return;
      }

      // The authored moment: the hatch parts and the drop is already floating.
      // The leaves stop short so the parted doors still frame the opening.
      gsap.to(doors, {
        xPercent: (i) => (i === 0 ? -86 : 86),
        duration: MOTION_DURATION.slow * 1.4,
        ease: MOTION_EASE.inOut,
        delay: 0.35,
      });

      // Scrolling past the hatch flies through it: the frame grows and the
      // ship's interior falls away, leaving open space.
      gsap.to(hatch.current, {
        scale: 1.7,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: section, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={section}
      data-stop={0}
      className="relative h-svh overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex justify-center"
      >
        <div
          ref={hatch}
          {...drag}
          className="pointer-events-auto relative cursor-grab touch-pan-y select-none active:cursor-grabbing mt-[10svh] h-[42svh] w-[min(72vw,24rem)] overflow-hidden rounded-t-full rounded-b-xl border border-foreground/20 shadow-[0_0_0_100vmax_rgb(6_6_10/0.22)] md:mt-[8svh] md:h-[50svh]"
        >
          <div
            data-door
            className="absolute inset-y-0 left-0 w-1/2 border-r border-foreground/15 bg-card"
          />
          <div data-door className="absolute inset-y-0 right-0 w-1/2 bg-card" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:pb-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="flex items-center gap-[0.35em] text-[clamp(2.25rem,8.5vw,5.5rem)] font-light uppercase leading-[0.95] tracking-[0.04em]">
            <StarMark />
            {drop.name}
            <StarMark />
          </h1>
          <span aria-hidden="true" className="my-5 h-px w-24 bg-border" />
          <p className="text-muted-foreground">
            Drop {drop.number} en vivo. {lead.name}.
          </p>
          <PiecePurchase
            piece={lead}
            variantId={variantId}
            onVariantChange={onVariantChange}
            idSuffix="hero"
            className="mt-6 w-full max-w-md items-center [&_fieldset]:items-center [&_legend]:sr-only"
          />
        </div>
      </div>
    </section>
  );
}

export default HatchHero;
