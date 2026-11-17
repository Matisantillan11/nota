"use client";

import { useProgress } from "@react-three/drei";

// Load state of the scene's assets (garment textures), for the page's
// loading screen. `done` only once something actually loaded and finished.
export function useSceneProgress(): { progress: number; done: boolean } {
  const { active, loaded, total } = useProgress();
  return {
    progress: total > 0 ? loaded / total : 0,
    done: total > 0 && loaded === total && !active,
  };
}

// Without WebGL the scene never loads anything; the page shows posters.
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
