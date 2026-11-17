"use client";

import { useTurnDrag } from "~/components/widgets/hangar-scene";

import PiecePurchase from "../piece-purchase";
import StarMark from "../star-mark";
import type { DropHeroProps } from "./types";

function DropHero({
  drop,
  variantId,
  onVariantChange,
  turnsRef,
}: DropHeroProps) {
  const drag = useTurnDrag(turnsRef, 0);
  const [lead] = drop.pieces;

  return (
    <section data-stop={0} className="relative h-svh overflow-hidden">
      {/* The lead garment's stage: horizontal drags here turn it. */}
      <div
        aria-hidden="true"
        {...drag}
        className="absolute inset-x-0 top-16 mx-auto h-[44svh] max-w-md cursor-grab touch-pan-y select-none active:cursor-grabbing md:h-[48svh]"
      />

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

export default DropHero;
