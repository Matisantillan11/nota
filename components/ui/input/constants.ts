import { cva } from "class-variance-authority";

// Heights track buttonVariants' `size` scale (sm: h-9, default: h-11, lg: h-12)
// so an Input and a Button of the matching size line up in the same row.
export const inputVariants = cva(
  [
    "flex w-full items-center gap-2", // layout
    "rounded-full border border-input bg-transparent", // shape
    "text-foreground transition-colors", // text
    "hover:border-foreground/40 focus-within:border-foreground/40 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring", // hover & focus state
    "has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-40", // disabled state
    "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:focus-within:outline-2 has-[input[aria-invalid=true]]:focus-within:outline-offset-2 has-[input[aria-invalid=true]]:focus-within:outline-destructive", // invalid state
  ],
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);
