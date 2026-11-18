"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import {
  SheetCoreCloseProps,
  SheetCoreContentProps,
  SheetCoreDescriptionProps,
  SheetCoreProps,
  SheetCoreTitleProps,
} from "./types";
import { useEffect, useState } from "react";

import { EXIT_TRANSITION_DURATION_MS } from "./constants";
import { cn } from "~/utils/cn";
import { createNamespaceComponent } from "~/utils/create-namespace-component";

function SheetCore({ children, ...props }: SheetCoreProps) {
  return (
    <DialogPrimitive.Root data-slot="sheet" {...props}>
      {children}
    </DialogPrimitive.Root>
  );
}

// Radix's Presence only auto-delays unmount for CSS @keyframes (it reads
// `animationName`), not plain `transition`s like the ones below — without
// `forceMount` + the EXIT_TRANSITION_DURATION_MS delay, Content/Overlay would
// vanish the instant `open` goes false, before the exit transition ever
// paints a frame.
function SheetCoreContent({
  className,
  children,
  open,
  side = "right",
  floating = false,
  ...props
}: SheetCoreContentProps) {
  // Radix's Root always renders this component — only Overlay/Content's own
  // internal Presence toggles their DOM output — so this component never
  // remounts between opens. Driving `isVisible` off the `open` prop (instead
  // of a mount-only effect) is what makes the transition replay every time,
  // not just the first.
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(!!open);
  const [renderedOpen, setRenderedOpen] = useState(open);

  if (open !== renderedOpen) {
    setRenderedOpen(open);
    if (open) {
      setShouldRender(true);
    } else {
      setIsVisible(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (open || !shouldRender) return;
    const timeout = setTimeout(
      () => setShouldRender(false),
      EXIT_TRANSITION_DURATION_MS,
    );
    return () => clearTimeout(timeout);
  }, [open, shouldRender]);

  if (!shouldRender) return null;

  return (
    <DialogPrimitive.Portal forceMount>
      <DialogPrimitive.Overlay
        forceMount
        data-slot="sheet-overlay"
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300 ease-out",
          // A floating sheet keeps the page visible behind it.
          floating ? "bg-background/30" : "bg-background/70 backdrop-blur-sm",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      />
      <DialogPrimitive.Content
        forceMount
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex w-full max-w-md flex-col gap-4 p-6 outline-none duration-300 ease-out",
          floating
            ? cn(
                "inset-y-4 w-[calc(100%-2rem)] rounded-3xl transition-[transform,opacity]",
                side === "left" ? "left-4" : "right-4",
                isVisible
                  ? "translate-x-0 opacity-100"
                  : side === "left"
                    ? "-translate-x-[calc(100%+2rem)] opacity-0"
                    : "translate-x-[calc(100%+2rem)] opacity-0",
              )
            : cn(
                "inset-y-0 h-full border-border bg-card/60 backdrop-blur-xl transition-[transform,max-width]",
                side === "left" ? "left-0 border-r" : "right-0 border-l",
                isVisible
                  ? "translate-x-0"
                  : side === "left"
                    ? "-translate-x-full"
                    : "translate-x-full",
              ),
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function SheetCoreTitle({ className, ...props }: SheetCoreTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn(className)}
      {...props}
    />
  );
}

function SheetCoreDescription({
  className,
  ...props
}: SheetCoreDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn(className)}
      {...props}
    />
  );
}

function SheetCoreClose({ className, ...props }: SheetCoreCloseProps) {
  return (
    <DialogPrimitive.Close
      data-slot="sheet-close"
      className={cn(className)}
      {...props}
    />
  );
}

export default createNamespaceComponent(SheetCore, {
  Content: SheetCoreContent,
  Title: SheetCoreTitle,
  Description: SheetCoreDescription,
  Close: SheetCoreClose,
});
