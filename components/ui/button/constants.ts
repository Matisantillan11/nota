import { cva } from "class-variance-authority";

// Values track DESIGN.md's `button-primary` / `button-ghost` specs: capsule
// shape, eyebrow label (12px uppercase, 0.24em tracking) and `14px 32px`
// padding (h-11). `sm`, `lg` and `icon` aren't confirmed there yet, so
// they're extrapolated from the same 4px spacing unit.
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2", // layout & alignment
    "whitespace-nowrap text-xs font-medium uppercase tracking-[0.24em]", // text
    "rounded-full", // shape
    "transition-colors", // motion
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:shadow-[0_0_24px_-4px_var(--color-ring)]", // focus state: signal ring + glow
    "disabled:pointer-events-none disabled:opacity-40", // disabled state
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", // icon children
    "cursor-auto hover:cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/85",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/85",
        outline:
          "border border-border bg-transparent text-foreground hover:border-foreground/40 hover:bg-accent/40",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "bg-transparent text-foreground hover:bg-accent/40",
        link: "h-auto bg-transparent p-0 text-sm font-light normal-case tracking-normal text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-8",
        sm: "h-9 px-5",
        lg: "h-12 px-10",
        icon: "size-11 tracking-normal",
      },
    },
    compoundVariants: [
      // `link` stays `h-auto` — it hugs the text like an inline link rather
      // than taking on a fixed button height, regardless of `size`.
      { variant: "link", class: "h-auto" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);
