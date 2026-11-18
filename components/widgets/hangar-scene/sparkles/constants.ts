// Pool size: the most sparkles alive at once.
export const SPARKLE_POOL = 140;
// Sparkles emitted per world unit the camera travels.
export const SPARKLES_PER_UNIT = 3.5;
// Most sparkles one frame may emit (keeps fast jumps from flooding the view).
export const MAX_SPARKLES_PER_FRAME = 5;
export const SPARKLE_LIFE = { min: 0.7, max: 1.4 } as const;
// Distance in front of the camera where sparkles appear.
export const SPARKLE_DEPTH = { min: 3, max: 12 } as const;

export const SPARKLE_VERTEX = /* glsl */ `
  attribute float aBirth;
  attribute float aLife;
  attribute float aSize;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    float age = (uTime - aBirth) / aLife;
    // Swell in, fade out; dead particles collapse to nothing.
    vAlpha = age >= 0.0 && age <= 1.0 ? sin(age * 3.14159) : 0.0;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * vAlpha * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

// A four-point star (the brand's ✦): a soft core plus two thin rays.
export const SPARKLE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float core = exp(-dot(p, p) * 18.0);
    float rays = max(0.0, 1.0 - abs(p.x) * 14.0) * max(0.0, 1.0 - abs(p.y))
               + max(0.0, 1.0 - abs(p.y) * 14.0) * max(0.0, 1.0 - abs(p.x));
    float star = clamp(core + rays * 0.9, 0.0, 1.0);
    gl_FragColor = vec4(uColor, star * vAlpha);
  }
`;
