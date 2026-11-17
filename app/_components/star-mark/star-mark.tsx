import { cn } from "~/utils/cn";
import type { StarMarkProps } from "./types";

// The brand's four-point star (✦), drawn so it renders the same everywhere.
function StarMark({ className }: StarMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("inline-block size-[0.42em] fill-current", className)}
    >
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
    </svg>
  );
}

export default StarMark;
