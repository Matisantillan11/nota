"use client";

import { useTurnDrag } from "~/components/widgets/hangar-scene";
import { cn } from "~/utils/cn";

import PiecePurchase from "../piece-purchase";
import type { PieceSectionProps } from "./types";

function PieceSection({
  piece,
  variantId,
  onVariantChange,
  turnsRef,
  index,
  stop,
}: PieceSectionProps) {
  const drag = useTurnDrag(turnsRef, index);
  // From tablet up, pieces alternate: even garments left, odd ones right.
  const garmentRight = index % 2 === 1;
  return (
    <section
      id={piece.id}
      aria-labelledby={`${piece.id}-title`}
      data-stop={stop}
      className="relative flex h-svh items-end justify-center px-6 pb-16 md:items-center md:px-12 md:pb-0"
    >
      {/* The garment's stage: horizontal drags here turn it; vertical ones
          scroll. Above the text on phones, the garment's column from tablet up. */}
      <div
        aria-hidden="true"
        {...drag}
        className={cn(
          "absolute inset-x-0 top-16 h-[36svh] cursor-grab touch-pan-y select-none active:cursor-grabbing md:inset-y-16 md:h-auto",
          garmentRight ? "md:left-1/2" : "md:right-1/2",
        )}
      />
      <div className="grid w-full max-w-6xl md:grid-cols-2">
        {/* The canvas draws the garment in this column. */}
        <div
          aria-hidden="true"
          className={cn("hidden md:block", garmentRight && "md:order-2")}
        />
        <div
          className={cn(
            "flex w-full max-w-md flex-col items-center justify-self-center text-center md:items-start md:text-left",
            garmentRight ? "md:justify-self-end" : "md:justify-self-start",
          )}
        >
          <h2
            id={`${piece.id}-title`}
            className="text-3xl font-light tracking-[0.02em] md:text-5xl"
          >
            {piece.name}
          </h2>
          {/* Phones give the garment the room; the description shows from tablet up. */}
          <p className="mt-4 hidden max-w-[46ch] leading-relaxed text-muted-foreground md:block">
            {piece.description}
          </p>
          <PiecePurchase
            piece={piece}
            variantId={variantId}
            onVariantChange={onVariantChange}
            idSuffix="detail"
            className="mt-3 w-full items-center md:mt-8 md:items-start [&_fieldset]:items-center md:[&_fieldset]:items-start"
          />
        </div>
      </div>
    </section>
  );
}

export default PieceSection;
