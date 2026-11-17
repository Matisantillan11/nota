import { cva } from "class-variance-authority";

export const selectTriggerVariants = cva(
  [
    "flex h-11 w-full items-center justify-between gap-2",
    "rounded-full border border-input bg-transparent px-4 py-2.5",
    "text-sm text-foreground transition-colors",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
    "[&>span]:line-clamp-1",
  ],
  {
    variants: {
      disabled: {
        true: "pointer-events-none opacity-50",
        false: "hover:border-foreground/40",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);
