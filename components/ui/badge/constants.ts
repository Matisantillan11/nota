import { cva } from "class-variance-authority";

// DESIGN.md → Badges: hairline capsule with an eyebrow label, outline by
// default ("new.", "not available."); fills are the exception.
export const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1", // layout & alignment
    "whitespace-nowrap text-xs font-medium uppercase tracking-[0.24em]", // text
    "rounded-full border border-transparent px-3 py-1", // shape
    "transition-colors", // motion
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", // focus state
    "[&>svg]:pointer-events-none [&>svg]:size-3", // icon children
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground [a&]:hover:bg-primary/85",
        destructive:
          "bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/85",
        outline:
          "border-border bg-transparent text-foreground [a&]:hover:border-foreground/40",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);
