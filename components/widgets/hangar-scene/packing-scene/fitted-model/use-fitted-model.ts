"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Box3, Group, Vector3 } from "three";

import type { FitOptions, FittedModel } from "./types";

// Loads a model and wraps it so it sits on y = 0, centred on x/z, scaled to
// the largest size that fits the footprint (turned 90° if that fits better).
export function useFittedModel(src: string, fit: FitOptions): FittedModel {
  const { scene } = useGLTF(src);

  return useMemo(() => {
    const model = scene.clone(true);
    const size = new Box3().setFromObject(model).getSize(new Vector3());
    const straight = Math.min(fit.width / size.x, fit.depth / size.z);
    const turned = Math.min(fit.width / size.z, fit.depth / size.x);
    const turn = turned > straight;
    const scale = Math.min(
      Math.max(straight, turned),
      fit.height ? fit.height / size.y : Infinity,
    );

    model.scale.setScalar(scale);
    if (turn) model.rotation.y = Math.PI / 2;
    const box = new Box3().setFromObject(model);
    const centre = box.getCenter(new Vector3());
    model.position.set(-centre.x, -box.min.y, -centre.z);

    const wrapper = new Group();
    wrapper.add(model);
    const fitted = box.getSize(new Vector3());
    return { object: wrapper, size: { x: fitted.x, y: fitted.y, z: fitted.z } };
  }, [scene, fit.width, fit.depth, fit.height]);
}
