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
            "group toast rounded-xl border border-border bg-card text-card-foreground shadow-lg",
          title: "text-foreground",
          description: "text-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-secondary text-foreground",
          error: "border-error/30 text-error",
          success: "border-success/30 text-success",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export default Toaster;
