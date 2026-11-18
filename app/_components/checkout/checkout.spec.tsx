import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CartProvider } from "~/app/_contexts/cart";
import Checkout from "./checkout";

// jsdom has no matchMedia (read for reduced motion).
vi.hoisted(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
});

// jsdom has no WebGL; the packing scene is checked in the browser.
vi.mock("~/components/widgets/hangar-scene", () => ({
  PackingScene: () => null,
}));

function renderCheckout() {
  return render(
    <CartProvider>
      <Checkout />
    </CartProvider>,
  );
}

describe("Checkout", () => {
  beforeEach(() => localStorage.clear());

  it("summarises the stored order and keeps payment off", async () => {
    localStorage.setItem(
      "nota.cart",
      JSON.stringify([
        {
          pieceId: "tee",
          name: "Remera Monochrome",
          size: "S",
          variant: "Negra",
          model: "tee-monochrome-black",
        },
      ]),
    );
    renderCheckout();
    const page = screen.getByRole("main", { name: "Checkout." });
    expect(within(page).getByText("Remera Monochrome")).toBeInTheDocument();
    expect(within(page).getByText("Negra · Talle S")).toBeInTheDocument();
    expect(within(page).getByRole("button", { name: "Pagar" })).toBeDisabled();
    expect(
      within(page).getByRole("link", { name: "Volver a la tienda" }),
    ).toHaveAttribute("href", "/");
  });

  it("says when there is nothing to pack", () => {
    renderCheckout();
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
  });
});
