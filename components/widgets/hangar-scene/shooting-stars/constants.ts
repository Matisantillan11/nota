// At most this many streaks per appearance (also the pool size).
export const MAX_STREAKS = 3;
// Seconds between appearances, picked at random in this range.
export const BURST_GAP = { min: 6, max: 12 } as const;
// Streaks in one appearance start up to this many seconds apart.
export const BURST_STAGGER = 0.7;
// Depth behind the garments (camera space), and streak geometry.
export const STREAK_DEPTH = 40;
export const STREAK_LENGTH = { min: 3.5, max: 6 } as const;
export const STREAK_SPEED = { min: 22, max: 32 } as const; // units/s
export const STREAK_LIFE = 0.9; // s

export const STREAK_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Tail (uv.x = 0) to bright head (uv.x = 1), thin across, faded by uFade.
export const STREAK_FRAGMENT = /* glsl */ `
  uniform float uFade;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float along = pow(vUv.x, 2.2);
    float across = 1.0 - abs(vUv.y * 2.0 - 1.0);
    // Bright core line with a soft falloff across, so it reads at 1-3px.
    float alpha = along * smoothstep(0.0, 1.0, across) * uFade;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
