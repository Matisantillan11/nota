"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "~/app/_contexts/cart";
import { Button } from "~/components/ui";

import { useReducedMotion } from "~/hooks/use-reduced-motion";

// WebGL is client-only.
const PackingScene = dynamic(
  () => import("~/components/widgets/hangar-scene").then((m) => m.PackingScene),
  { ssr: false },
);

// The /checkout page: the order packing on one side, its summary on the other.
function Checkout() {
  const reducedMotion = useReducedMotion();
  const { items } = useCart();
  const [packed, setPacked] = useState(false);

  return (
    <main
      aria-labelledby="checkout-title"
      className="grid min-h-svh bg-background md:grid-cols-[1fr_minmax(0,26rem)]"
    >
      <div className="relative h-[52svh] md:h-auto">
        {items.length > 0 ? (
          <PackingScene
            garments={items.map((item) => item.model)}
            reducedMotion={reducedMotion}
            onPacked={() => setPacked(true)}
            label={`Tu pedido empaquetándose: ${items.map((item) => item.name).join(", ")}.`}
          />
        ) : null}
        <p
          aria-live="polite"
          className="absolute inset-x-0 bottom-4 text-center text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
        >
          {items.length === 0
            ? "Tu carrito está vacío."
            : packed
              ? "Listo para enviar."
              : "Empaquetando tu pedido."}
        </p>
      </div>

      <aside className="liquid-glass relative m-4 flex flex-col gap-4 rounded-3xl p-6 backdrop-blur-[48px] md:ml-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 id="checkout-title" className="text-xl font-normal">
              Checkout.
            </h1>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "pieza" : "piezas"}.
            </p>
          </div>
          <Button asChild variant="link">
            <Link href="/">Volver a la tienda</Link>
          </Button>
        </div>

        <ul className="flex flex-col overflow-y-auto">
          {items.map((item, i) => (
            <li
              key={`${item.pieceId}-${i}`}
              className="flex items-center justify-between gap-4 border-b border-border py-3"
            >
              <span>{item.name}</span>
              <span className="text-sm text-muted-foreground">
                {[item.variant, `Talle ${item.size}`]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <div className="flex items-baseline justify-between py-2 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span>A confirmar.</span>
          </div>
          <div className="button-mist">
            <Button size="lg" disabled className="w-full">
              Pagar
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            El pago se habilita pronto.
          </p>
        </div>
      </aside>
    </main>
  );
}

export default Checkout;
