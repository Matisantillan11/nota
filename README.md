# NOTA.

NOTA. ("Espacio Creativo.") is a monochrome, space-inspired apparel brand. This is its immersive e-commerce: garments are shown as interactive 3D objects (three.js), animation runs on GSAP, and the whole experience is dark-only, minimal and premium.

Stack: Next.js, Tailwind, Radix, tRPC, Storybook, Vitest, Sentry, PostHog.

## Getting started

```bash
cp .env.example .env.local   # fill in the values
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

- [`DESIGN.md`](./DESIGN.md) — visual identity: colors, Jost typography, motion, 3D rules.
- [`FOUNDATIONS.md`](./FOUNDATIONS.md) — code conventions and folder structure.
- [`CONTRIBUTION.md`](./CONTRIBUTION.md) — git workflow and PR process.

## Scripts

| Script                            | What it does                     |
| --------------------------------- | -------------------------------- |
| `pnpm dev` / `build` / `start`    | Next.js dev server, build, serve |
| `pnpm test` / `test:watch`        | Vitest (unit + Storybook)        |
| `pnpm storybook`                  | Storybook on port 6006           |
| `pnpm check:types` / `check:lint` | Type check, lint                 |
| `pnpm format`                     | Prettier                         |
