import type { Metadata } from "next";

import Checkout from "../_components/checkout";

export const metadata: Metadata = { title: "Checkout · NOTA." };

export default function CheckoutPage() {
  return <Checkout />;
}
