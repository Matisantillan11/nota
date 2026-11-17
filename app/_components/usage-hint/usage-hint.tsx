import type { UsageHintProps } from "./types";

// One fixed line of instructions, so product sections spend no space on them.
function UsageHint({ ref }: UsageHintProps) {
  return (
    <p
      ref={ref}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-20 text-center text-xs tracking-wide text-muted-foreground transition-opacity duration-300"
    >
      Arrastrá para girar · Bajá para ver más
    </p>
  );
}

export default UsageHint;
