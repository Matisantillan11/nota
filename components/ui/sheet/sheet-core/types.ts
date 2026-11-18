import type { ComponentPropsWithRef } from "react";
import type * as DialogPrimitive from "@radix-ui/react-dialog";

export type SheetCoreProps = ComponentPropsWithRef<typeof DialogPrimitive.Root>;

export type SheetCoreContentProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Content
> & {
  open?: boolean;
  /** Edge the sheet enters from. Defaults to "right". */
  side?: "left" | "right";
  /** Detached from the edge: inset, rounded, and the page stays visible. */
  floating?: boolean;
};

export type SheetCoreTitleProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Title
>;

export type SheetCoreDescriptionProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Description
>;

export type SheetCoreCloseProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Close
>;
