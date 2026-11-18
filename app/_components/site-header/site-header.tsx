"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "~/app/_contexts/cart";
import { Button, Sheet } from "~/components/ui";
import { useToast } from "~/hooks/use-toast";

function SiteHeader() {
  const { items, remove } = useCart();
  const [open, setOpen] = useState(false);
  const { dismiss } = useToast();

  // The drawer answers the "added" toast, so it shouldn't stay stacked on it.
  function openCart() {
    dismiss();
    setOpen(true);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-6 md:px-12">
      <Link
        href="/"
        className="text-lg font-normal uppercase tracking-[0.08em]"
      >
        NOTA.
      </Link>
      <button
        type="button"
        onClick={openCart}
        className="rounded-full px-1 py-2 text-xs font-medium uppercase tracking-[0.24em] outline-none transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        Carrito <span className="tabular-nums">({items.length})</span>
      </button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Carrito."
        side="right"
        floating
        className="liquid-glass float-drift backdrop-blur-[48px]"
        description={
          items.length
            ? `${items.length} ${items.length === 1 ? "pieza" : "piezas"}.`
            : undefined
        }
      >
        {/* Fills the panel so the checkout block always sits at the bottom. */}
        <div className="flex min-h-full flex-col">
          {items.length === 0 ? (
            <p className="pt-10 text-center text-muted-foreground">
              Todavía no agregaste nada.
            </p>
          ) : (
            <ul className="flex flex-col">
              {items.map((item, i) => (
                <li
                  key={`${item.pieceId}-${i}`}
                  className="flex items-center justify-between gap-4 border-b border-border py-4"
                >
                  <div>
                    <p className="font-normal">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {[item.variant, `Talle ${item.size}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <Button
                    variant="link"
                    onClick={() => remove(i)}
                    aria-label={`Quitar ${item.name} talle ${item.size}`}
                  >
                    Quitar
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto flex flex-col gap-3 pb-2 pt-6">
            <div className="flex items-baseline justify-between py-2 text-sm">
              <span className="text-muted-foreground">Total</span>
              <span>A confirmar.</span>
            </div>
            <div className="button-mist">
              <Button size="lg" disabled className="w-full">
                Finalizar compra
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              El pago se habilita pronto.
            </p>
          </div>
        </div>
      </Sheet>
    </header>
  );
}

export default SiteHeader;
