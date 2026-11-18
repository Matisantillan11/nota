# NOTA.

NOTA. ("Espacio Creativo.") is a space-inspired apparel studio that releases limited drops. This is its immersive store: the visitor enters through a hatch welded shut by a laser, and each garment of the live drop floats in deep space as a 3D model they can turn and buy. Dark-only and electric: chrome, liquid metal and electric pink over deep space.

## The experience

- **Loading gate:** a laser welds the hatch while the 3D models load; the doors open on the drop with a low burst of decontamination mist.
- **One section per gesture:** wheel, swipe or arrow keys move exactly one section; the camera flies to the next garment and only one is on screen at a time.
- **Garments:** the brand's glTF models, turning 360° (drag to turn). The hoodie makes one turn with its lights off, then its reflective lines switch on; the tee's colour (Blanca / Negra) swaps with the same scan line.
- **Liquid metal:** mercury-like chrome droplets around each garment, chrome display type and an electric pink accent.
- **Atmosphere:** layered starfield, backlit mist behind each garment, movement sparkles and occasional shooting stars. Everything respects `prefers-reduced-motion`.

Prices, sizes and checkout are placeholders until the commerce backend exists (see `PRODUCT.md`).

## Stack

Next.js (App Router), Tailwind, three.js via `@react-three/fiber` + `@react-three/drei`, GSAP (ScrollTrigger, Observer), Radix, tRPC, Storybook, Vitest, Sentry, PostHog.

## Getting started

```bash
cp .env.example .env.local   # fill in the values
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). `next dev` is noticeably slower than production; judge performance with `pnpm build && pnpm start`.

## 3D models

Source models live in `assets-src/models/` (not served). The site serves optimized copies from `public/models/` (meshopt geometry, WebP textures at 1024px, ~1 MB each instead of ~40 MB). After adding or changing a source model, regenerate them:

```bash
pnpm models:optimize
```

Model paths and per-garment settings (lit state, mist strength) are in `components/widgets/hangar-scene/constants.ts`.

## Docs

- [`PRODUCT.md`](./PRODUCT.md) — product truth: users, drops, markets, constraints.
- [`DESIGN.md`](./DESIGN.md) — visual system: liquid metal world, colors, Jost typography, motion, 3D and atmosphere rules.
- [`FOUNDATIONS.md`](./FOUNDATIONS.md) — code conventions and folder structure.
- [`CONTRIBUTION.md`](./CONTRIBUTION.md) — git workflow and PR process.

## Scripts

| Script                            | What it does                                      |
| --------------------------------- | ------------------------------------------------- |
| `pnpm dev` / `build` / `start`    | Next.js dev server, build, serve                  |
| `pnpm test` / `test:watch`        | Vitest (unit + Storybook stories in Chromium)     |
| `pnpm storybook`                  | Storybook on port 6006                            |
| `pnpm check:types` / `check:lint` | Type check, lint                                  |
| `pnpm format`                     | Prettier                                          |
| `pnpm models:optimize`            | Optimize `assets-src/models` into `public/models` |
