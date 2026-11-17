"use client";

import { Toaster as SonnerToaster } from "sonner";
import { ToasterProps } from "./types";
import { cn } from "~/utils/cn";

function Toaster({ className, toastOptions, ...props }: ToasterProps) {
  return (
    <SonnerToaster
      data-slot="toaster"
      theme="dark"
      className={cn("toaster group", className)}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast:
            "group toast rounded-xl border border-border bg-card/60 text-card-foreground backdrop-blur-xl",
          title: "text-foreground",
          description: "text-muted-foreground",
          actionButton:
            "rounded-full bg-primary text-xs font-medium uppercase tracking-[0.24em] text-primary-foreground",
          cancelButton:
            "rounded-full bg-secondary text-xs font-medium uppercase tracking-[0.24em] text-foreground",
          error: "border-destructive/30 text-destructive",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export default Toaster;
