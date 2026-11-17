"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import {
  PopoverCoreAnchorProps,
  PopoverCoreContentProps,
  PopoverCoreProps,
  PopoverCoreTriggerProps,
} from "./types";

import { cn } from "~/utils/cn";
import { createNamespaceComponent } from "~/utils/create-namespace-component";

function PopoverCore({ children, ...props }: PopoverCoreProps) {
  return (
    <PopoverPrimitive.Root data-slot="popover" {...props}>
      {children}
    </PopoverPrimitive.Root>
  );
}

function PopoverCoreTrigger({ className, ...props }: PopoverCoreTriggerProps) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function PopoverCoreAnchor({ className, ...props }: PopoverCoreAnchorProps) {
  return (
    <PopoverPrimitive.Anchor
      data-slot="popover-anchor"
      className={cn(className)}
      {...props}
    />
  );
}

function PopoverCoreContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverCoreContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-auto rounded-lg border border-border bg-secondary p-4 text-secondary-foreground ring-1 ring-foreground/5 outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export default createNamespaceComponent(PopoverCore, {
  Trigger: PopoverCoreTrigger,
  Anchor: PopoverCoreAnchor,
  Content: PopoverCoreContent,
});
