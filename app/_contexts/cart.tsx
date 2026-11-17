"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type {
  CartContextValue,
  CartItem,
  CartProviderProps,
} from "~/app/_types/cart";

const CartContext = createContext<CartContextValue | null>(null);

// shortcut: in-memory cart, lost on reload; replace with the commerce
// backend's cart once a checkout provider is chosen (PRODUCT.md).
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const value = useMemo(
    () => ({
      items,
      add: (item: CartItem) => setItems((current) => [...current, item]),
      remove: (index: number) =>
        setItems((current) => current.filter((_, i) => i !== index)),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>.");
  return context;
}
