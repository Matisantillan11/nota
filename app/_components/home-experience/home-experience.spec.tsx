import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LIVE_DROP, NEXT_DROP } from "~/app/_constants/drops";
import HomeExperience from "./home-experience";

// jsdom has no matchMedia, and GSAP's ScrollTrigger reads it at import time.
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

// jsdom has no WebGL; the scene's DOM contract is covered by its own story.
vi.mock("~/components/widgets/hangar-scene", () => ({
  default: () => null,
  GarmentPoster: () => null,
  createTurnState: () => ({
    angle: 0,
    velocity: 0,
    dragging: false,
    lastInput: 0,
  }),
  useTurnDrag: () => ({}),
  useSceneProgress: () => ({ progress: 1, done: true }),
  hasWebGL: () => true,
}));

function renderHome() {
  return render(<HomeExperience drop={LIVE_DROP} nextDrop={NEXT_DROP} />);
}

describe("Home", () => {
  it("presents the live drop, each piece and the next drop", () => {
    renderHome();

    expect(
      screen.getByRole("heading", { level: 1, name: /monochrome/i }),
    ).toBeInTheDocument();
    for (const piece of LIVE_DROP.pieces) {
      expect(
        screen.getByRole("heading", { level: 2, name: piece.name }),
      ).toBeInTheDocument();
    }
    expect(
      screen.getByRole("heading", { name: `Drop ${NEXT_DROP.number}` }),
    ).toBeInTheDocument();
  });

  it("says the price is pending rather than inventing one", () => {
    renderHome();
    expect(
      screen.getAllByText("Precio a confirmar · ARS y USD.").length,
    ).toBeGreaterThan(0);
  });

  it("leads to the size picker until a size is chosen", async () => {
    const user = userEvent.setup();
    renderHome();
    const section = screen.getByRole("region", { name: "Remera Monochrome" });

    await user.click(
      within(section).getByRole("button", { name: "Elegí un talle" }),
    );
    expect(within(section).getByRole("radio", { name: "S" })).toHaveFocus();
    expect(
      screen.getByRole("button", { name: /carrito \(0\)/i }),
    ).toBeInTheDocument();

    await user.click(within(section).getByRole("radio", { name: "M" }));
    expect(
      within(section).getByRole("button", { name: "Agregar al carrito" }),
    ).toBeEnabled();
  });

  it("adds the piece to the cart and lists it there", async () => {
    const user = userEvent.setup();
    renderHome();
    const section = screen.getByRole("region", { name: "Remera Monochrome" });

    await user.click(within(section).getByRole("radio", { name: "L" }));
    await user.click(
      within(section).getByRole("button", { name: "Agregar al carrito" }),
    );

    const cartButton = screen.getByRole("button", { name: /carrito \(1\)/i });
    await user.click(cartButton);

    const sheet = await screen.findByRole("dialog");
    expect(within(sheet).getByText("Remera Monochrome")).toBeInTheDocument();
    expect(within(sheet).getByText("Blanca · Talle L")).toBeInTheDocument();
    expect(
      within(sheet).getByRole("button", { name: "Finalizar compra" }),
    ).toBeDisabled();
  });

  it("offers the tee in both colourways and carries the choice to the cart", async () => {
    const user = userEvent.setup();
    renderHome();
    const section = screen.getByRole("region", { name: "Remera Monochrome" });

    expect(
      within(section).getByRole("radio", { name: "Blanca" }),
    ).toBeChecked();
    await user.click(within(section).getByRole("radio", { name: "Negra" }));
    await user.click(within(section).getByRole("radio", { name: "S" }));
    await user.click(
      within(section).getByRole("button", { name: "Agregar al carrito" }),
    );
    await user.click(screen.getByRole("button", { name: /carrito \(1\)/i }));

    const sheet = await screen.findByRole("dialog");
    expect(within(sheet).getByText("Negra · Talle S")).toBeInTheDocument();
  });

  it("does not ask for a colour when a piece has only one", () => {
    renderHome();
    const section = screen.getByRole("region", { name: "Hoodie Monochrome" });
    expect(within(section).queryByText("Color")).not.toBeInTheDocument();
  });
});
