import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import Toaster from "./toast";
import { toast } from "sonner";

// sonner reads matchMedia, which jsdom doesn't implement.
beforeEach(() => {
  window.matchMedia =
    window.matchMedia ??
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
});

describe("Toaster", () => {
  it("renders a toast viewport", () => {
    render(<Toaster />);

    expect(
      screen.getByRole("region", { name: /notifications/i }),
    ).toBeInTheDocument();
  });

  it("shows a toast triggered via the sonner toast() function", async () => {
    render(<Toaster />);

    act(() => {
      toast("Event created");
    });

    expect(await screen.findByText("Event created")).toBeInTheDocument();
  });
});
