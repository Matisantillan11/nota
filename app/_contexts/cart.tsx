"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import type {
  CartContextValue,
  CartItem,
  CartProviderProps,
} from "~/app/_types/cart";
import { getStorageItem, setStorageItem } from "~/utils/local-storage";

const CartContext = createContext<CartContextValue | null>(null);

// shortcut: the cart lives in localStorage so it survives navigation (store
// -> /checkout) and reloads; replace with the commerce backend's cart once a
// checkout provider is chosen (PRODUCT.md).
const STORAGE_KEY = "nota.cart";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
// Parsed once per stored value, so useSyncExternalStore gets a stable array.
let cached: { raw: string | null; items: CartItem[] } = {
  raw: null,
  items: EMPTY,
};

function read(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cached.raw) {
    cached = { raw, items: getStorageItem<CartItem[]>(STORAGE_KEY, EMPTY) };
  }
  return cached.items;
}

function write(items: CartItem[]) {
  setStorageItem(STORAGE_KEY, items);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Other tabs change the same cart.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function CartProvider({ children }: CartProviderProps) {
  // The server renders an empty cart; the stored one arrives on hydration.
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const value = useMemo(
    () => ({
      items,
      add: (item: CartItem) => write([...read(), item]),
      remove: (index: number) => write(read().filter((_, i) => i !== index)),
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
