import StarMark from "../star-mark";
import { INSTAGRAM_URL } from "./constants";
import type { NextDropProps } from "./types";

function NextDrop({ number, message, stop }: NextDropProps) {
  return (
    <section
      aria-labelledby="next-drop-title"
      data-stop={stop}
      className="relative flex h-svh flex-col items-center justify-center px-6 text-center"
    >
      <h2
        id="next-drop-title"
        className="flex items-center gap-[0.35em] text-4xl font-light uppercase tracking-[0.04em] md:text-5xl"
      >
        <StarMark />
        Drop {number}
        <StarMark />
      </h2>
      <span aria-hidden="true" className="my-6 h-px w-24 bg-border" />
      <p className="text-xl font-light">{message}</p>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-10 text-sm text-muted-foreground underline-offset-4 outline-none transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        Seguí la señal en Instagram.
      </a>
    </section>
  );
}

export default NextDrop;
