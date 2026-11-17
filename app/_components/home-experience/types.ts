import type { Drop } from "~/app/_types/drop";

export interface HomeExperienceProps {
  drop: Drop;
  nextDrop: { number: string; message: string };
}
