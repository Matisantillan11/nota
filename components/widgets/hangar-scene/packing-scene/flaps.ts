import {
  type Material,
  Matrix4,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
} from "three";

// The open box model is a single mesh; its three flaps are told apart by
// position (measured on assets-src/models/open-shipping-box.glb, in the
// model's own units): everything above the rim, beyond a body wall.
export const BOX_GEOMETRY = {
  modelWidth: 1.902,
  // Lowest point of the model (the box's floor), in model units.
  minY: -0.529,
  rimY: 0.19,
  body: { minX: -0.59, maxX: 0.58, minZ: -0.33, maxZ: 0.62 },
  // How far each flap turns about its hinge to lie on the rim (side flaps
  // about z, back about x), fitted on the model so each flap's median height
  // lands on the rim (the cardboard is slightly bent, so it's not exact).
  fold: {
    left: (-126.65 * Math.PI) / 180,
    right: (136 * Math.PI) / 180,
    back: (129.6 * Math.PI) / 180,
  },
  // Each flap that closes later rests higher, on the ones already down
  // (left, then right, then back over both).
  lift: { right: 0.015, back: 0.045 },
} as const;

export interface FlapUniforms {
  uLeft: { value: number };
  uRight: { value: number };
  uBack: { value: number };
}

const GLSL_FOLD = /* glsl */ `
  uniform float uLeft;
  uniform float uRight;
  uniform float uBack;
  uniform mat4 uToSource;
  uniform mat4 uFromSource;

  vec3 rotZ(vec3 p, vec3 pivot, float a) {
    vec3 d = p - pivot;
    float c = cos(a), s = sin(a);
    return pivot + vec3(d.x * c - d.y * s, d.x * s + d.y * c, d.z);
  }
  vec3 rotX(vec3 p, vec3 pivot, float a) {
    vec3 d = p - pivot;
    float c = cos(a), s = sin(a);
    return pivot + vec3(d.x, d.y * c - d.z * s, d.y * s + d.z * c);
  }
  // Folds one point (or, with pivot 0, one direction) by the flap it belongs to.
  vec3 fold(vec3 src, vec3 p, bool isDir) {
    if (src.y < ${BOX_GEOMETRY.rimY.toFixed(3)}) return p;
    vec3 hingeL = isDir ? vec3(0.0) : vec3(${BOX_GEOMETRY.body.minX.toFixed(3)}, ${BOX_GEOMETRY.rimY.toFixed(3)}, 0.0);
    vec3 hingeR = isDir ? vec3(0.0) : vec3(${BOX_GEOMETRY.body.maxX.toFixed(3)}, ${BOX_GEOMETRY.rimY.toFixed(3)}, 0.0);
    vec3 hingeB = isDir ? vec3(0.0) : vec3(0.0, ${BOX_GEOMETRY.rimY.toFixed(3)}, ${BOX_GEOMETRY.body.minZ.toFixed(3)});
    // A vertex belongs to the flap it sticks out furthest toward: a flap
    // leans outward, so its own direction always wins, corners included.
    float outL = ${BOX_GEOMETRY.body.minX.toFixed(3)} - src.x;
    float outR = src.x - ${BOX_GEOMETRY.body.maxX.toFixed(3)};
    float outB = ${BOX_GEOMETRY.body.minZ.toFixed(3)} - src.z;
    // Inside the body's footprint (the walls' top edge): not a flap.
    if (max(outL, max(outR, outB)) < -0.01) return p;
    float lift = isDir ? 0.0 : 1.0;
    if (outL >= outR && outL >= outB) return rotZ(p, hingeL, uLeft * ${BOX_GEOMETRY.fold.left.toFixed(4)});
    if (outR >= outB) return rotZ(p, hingeR, uRight * ${BOX_GEOMETRY.fold.right.toFixed(4)}) + vec3(0.0, uRight * lift * ${BOX_GEOMETRY.lift.right.toFixed(3)}, 0.0);
    return rotX(p, hingeB, uBack * ${BOX_GEOMETRY.fold.back.toFixed(4)}) + vec3(0.0, uBack * lift * ${BOX_GEOMETRY.lift.back.toFixed(3)}, 0.0);
  }
`;

// Patches the open box's materials so its flaps fold by the given uniforms.
// Positions are mapped into the model's source units first: the optimized
// file stores quantized positions, restored by node transforms.
export function makeFlapsFoldable(root: Object3D): {
  uniforms: FlapUniforms;
  materials: Material[];
} {
  // Idempotent: React may run the caller's useMemo twice (dev), and a second
  // patch would leave the mesh on materials nobody drives.
  if (root.userData.flaps) return root.userData.flaps;
  const uniforms: FlapUniforms = {
    uLeft: { value: 0 },
    uRight: { value: 0 },
    uBack: { value: 0 },
  };
  const materials: Material[] = [];
  root.updateMatrixWorld(true);
  const rootInverse = new Matrix4().copy(root.matrixWorld).invert();

  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const toSource = new Matrix4().multiplyMatrices(
      rootInverse,
      mesh.matrixWorld,
    );
    const fromSource = toSource.clone().invert();
    const material = (mesh.material as MeshStandardMaterial).clone();
    material.transparent = true;
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms, {
        uToSource: { value: toSource },
        uFromSource: { value: fromSource },
      });
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\n${GLSL_FOLD}`)
        .replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>
           {
             vec3 src = (uToSource * vec4(position, 1.0)).xyz;
             vec3 n = mat3(uToSource) * objectNormal;
             objectNormal = normalize(mat3(uFromSource) * fold(src, n, true));
           }`,
        )
        .replace(
          "#include <begin_vertex>",
          `vec3 transformed;
           {
             vec3 src = (uToSource * vec4(position, 1.0)).xyz;
             transformed = (uFromSource * vec4(fold(src, src, false), 1.0)).xyz;
           }`,
        );
    };
    material.customProgramCacheKey = () => "box-flaps";
    mesh.material = material;
    materials.push(material);
  });

  root.userData.flaps = { uniforms, materials };
  return root.userData.flaps;
}
