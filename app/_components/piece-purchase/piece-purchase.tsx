"use client";

import { useRef, useState } from "react";

import { useCart } from "~/app/_contexts/cart";
import { formatPrice } from "~/app/_utils/format-price";
import { Button } from "~/components/ui";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/utils/cn";

import OptionPicker from "../option-picker";
import type { PiecePurchaseProps } from "./types";

function PiecePurchase({
  piece,
  variantId,
  onVariantChange,
  idSuffix,
  className,
}: PiecePurchaseProps) {
  // The smallest size is preselected, so the piece can go to the cart at once.
  const [size, setSize] = useState<string | null>(piece.sizes[0] ?? null);
  const picker = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const { success } = useToast();

  function handleAdd() {
    // Without a size the action leads the visitor to the picker instead.
    if (!size) {
      picker.current?.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    const variant =
      piece.variants.length > 1
        ? (piece.variants.find((v) => v.id === variantId)?.label ?? null)
        : null;
    add({ pieceId: piece.id, name: piece.name, size, variant });
    success("Agregado al carrito.", {
      description: [piece.name, variant, `Talle ${size}`]
        .filter(Boolean)
        .join(" · "),
    });
  }

  if (!piece.available) {
    return (
      <p className={cn("text-xl font-light", className)}>not available.</p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3 md:gap-6", className)}>
      <p className="text-lg font-normal tabular-nums md:text-xl">
        {formatPrice(piece.price)}
      </p>
      {piece.variants.length > 1 && (
        <OptionPicker
          legend="Color"
          name={`color-${piece.id}-${idSuffix}`}
          options={piece.variants.map((v) => ({ value: v.id, label: v.label }))}
          value={variantId}
          onChange={onVariantChange}
        />
      )}
      <div ref={picker}>
        <OptionPicker
          legend="Talle"
          name={`size-${piece.id}-${idSuffix}`}
          options={piece.sizes.map((s) => ({ value: s, label: s }))}
          value={size}
          onChange={setSize}
        />
      </div>
      <Button
        size="default"
        variant={size ? "primary" : "outline"}
        onClick={handleAdd}
        className="w-full sm:w-auto"
      >
        {size ? "Agregar al carrito" : "Elegí un talle"}
      </Button>
    </div>
  );
}

export default PiecePurchase;
