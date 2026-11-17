"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Box3,
  type Material,
  type Mesh,
  type MeshStandardMaterial,
  Plane,
  Vector3,
} from "three";

import { GARMENT_HEIGHT } from "../../constants";

// Texture luminance from which a texel counts as a lit line, not fabric.
const LINE_THRESHOLD = 0.93;
// Seconds of fluorescent-style flicker before the lines hold steady.
const FLICKER_SECONDS = 0.7;
import type { ModelMeshProps } from "./types";

// One garment model, cloned (so its materials are its own to fade and clip),
// scaled to GARMENT_HEIGHT and centred on the origin.
function ModelMesh({
  src,
  clip,
  cutRef,
  glow = 0,
  materialsRef,
}: ModelMeshProps) {
  const { scene } = useGLTF(src);
  const plane = useRef(new Plane(new Vector3(0, -1, 0), 0));

  const { object, materials } = useMemo(() => {
    const clone = scene.clone(true);
    const owned: Material[] = [];
    clone.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const material = (mesh.material as MeshStandardMaterial).clone();
      material.transparent = true;
      // Self-light masked to the texture's pure-white texels: in the lit
      // model those are the reflective lines, brighter than the off-white
      // fabric. Starts at 0 and ramps up only when this layer is lit.
      material.emissive.set("#ffffff");
      material.emissiveMap = material.map;
      material.emissiveIntensity = 0;
      material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <emissivemap_fragment>",
          `#ifdef USE_EMISSIVEMAP
            vec4 emissiveColor = texture2D(emissiveMap, vEmissiveMapUv);
            float lum = dot(emissiveColor.rgb, vec3(0.299, 0.587, 0.114));
            totalEmissiveRadiance *= smoothstep(${LINE_THRESHOLD.toFixed(2)}, 0.995, lum);
          #endif`,
        );
      };
      material.customProgramCacheKey = () => "garment-lit-lines";
      mesh.material = material;
      owned.push(material);
    });
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const centre = box.getCenter(new Vector3());
    const scale = GARMENT_HEIGHT / size.y;
    clone.scale.setScalar(scale);
    clone.position.copy(centre.multiplyScalar(-scale));
    return { object: clone, materials: owned };
  }, [scene]);

  useEffect(() => {
    const registry = materialsRef.current;
    materials.forEach((material) => registry?.add(material));
    return () => {
      materials.forEach((material) => {
        registry?.delete(material);
        material.dispose();
      });
    };
  }, [materials, materialsRef]);

  useEffect(() => {
    // "below" keeps y <= cut (normal down), "above" keeps y >= cut.
    plane.current.normal.set(0, clip === "above" ? 1 : -1, 0);
    materials.forEach((material) => {
      material.clippingPlanes = clip ? [plane.current] : null;
      material.needsUpdate = true;
    });
  }, [materials, clip]);

  const litAt = useRef<number | null>(null);

  useFrame(({ clock }) => {
    // The lines strike like a tube light: a few flickers, then steady.
    let level = 0;
    if (glow > 0) {
      litAt.current ??= clock.elapsedTime;
      const t = clock.elapsedTime - litAt.current;
      level =
        t < FLICKER_SECONDS
          ? (Math.sin(t * 47) > 0.2 ? 1 : 0.15) *
            (0.4 + (0.6 * t) / FLICKER_SECONDS)
          : 1;
    }
    materials.forEach((material) => {
      (material as MeshStandardMaterial).emissiveIntensity = glow * level;
    });
    if (!clip) return;
    const cut = cutRef.current ?? 0;
    plane.current.constant = clip === "above" ? -cut : cut;
  });

  return <primitive object={object} />;
}

export default ModelMesh;
