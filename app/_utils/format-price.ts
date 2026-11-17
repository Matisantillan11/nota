import type { Piece } from "~/app/_types/drop";

const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
const usd = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Both markets until currency selection is decided (PRODUCT.md).
export function formatPrice(price: Piece["price"]): string {
  if (!price) return "Precio a confirmar · ARS y USD.";
  return `${ars.format(price.ars)} · ${usd.format(price.usd)}`;
}
