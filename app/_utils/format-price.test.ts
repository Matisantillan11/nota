import { describe, expect, it } from "vitest";
import { formatPrice } from "./format-price";

describe("formatPrice", () => {
  it("says the price is pending instead of inventing one", () => {
    expect(formatPrice(null)).toBe("Precio a confirmar · ARS y USD.");
  });

  it("shows both markets", () => {
    const text = formatPrice({ ars: 85000, usd: 70 });
    expect(text).toContain("85.000");
    expect(text).toContain("70");
    expect(text).toContain("·");
  });
});
