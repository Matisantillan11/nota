---
version: alpha
name: NOTA. - Immersive 3D apparel e-commerce
description: NOTA. ("Espacio Creativo.") is a monochrome streetwear studio with a space/sci-fi imagination. The store is a dark-only void where each garment floats as a live three.js object the visitor can turn. Neutral black-and-gray surfaces, a near-white foreground, and a single electric "signal" blue reserved for light and focus. Jost everywhere, thin rules and four-point star ornaments for structure, slow GSAP motion with the occasional glitch. Minimal, premium, clean.

colors:
  background: "var(--color-background)"
  foreground: "var(--color-foreground)"
  card: "var(--color-card)"
  card-foreground: "var(--color-card-foreground)"
  primary: "var(--color-primary)"
  primary-foreground: "var(--color-primary-foreground)"
  secondary: "var(--color-secondary)"
  secondary-foreground: "var(--color-secondary-foreground)"
  muted: "var(--color-muted)"
  muted-foreground: "var(--color-muted-foreground)"
  accent: "var(--color-accent)"
  accent-foreground: "var(--color-accent-foreground)"
  signal: "var(--color-signal)"
  destructive: "var(--color-destructive)"
  destructive-foreground: "var(--color-destructive-foreground)"
  border: "var(--color-border)"
  input: "var(--color-input)"
  ring: "var(--color-ring)"

typography:
  display:
    fontFamily: Jost
    fontSize: 88px
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "0.04em"
    textTransform: uppercase
  heading-1:
    fontFamily: Jost
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "0.02em"
  title:
    fontFamily: Jost
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.3
  eyebrow:
    fontFamily: Jost
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.24em"
    textTransform: uppercase
  body:
    fontFamily: Jost
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.7
  caption:
    fontFamily: Jost
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px

spacing:
  unit: 4px

motion:
  duration-fast: 0.3s
  duration-base: 0.6s
  duration-slow: 1.2s
  ease-default: "power3.out"
  ease-reveal: "expo.out"
  ease-inout: "power2.inOut"
  stagger: 0.06s

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "14px 32px"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.border}"
    rounded: "{rounded.xl}"
  tooltip:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
---

## Overview

NOTA. is a small apparel studio (tees, hoodies) whose bio is just "Espacio Creativo." — and "espacio" is taken literally: the brand's imagery is garments floating in voids, holograms, neon nightlife and glitches. The store continues that: the page is not a white sheet with product photos, it's a dark space where every garment is a real three.js object the user can turn, inspect and approach. The UI is the thinnest possible layer on top: type, thin rules and light.

Three words decide every call: **minimal, premium, clean**. When in doubt, remove.

### Brand analysis

Source: the brand's Instagram (`@nota__studio_`, 6 posts + highlights, reviewed 2026-11-17).

| Observed                                                                                                                                                | What it means for the site                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Logo `NOTA.` — uppercase geometric sans, light/regular weight, white on a solid black circle                                                            | Jost is the right (and only) typeface. The period is part of the identity.                                          |
| The first collection is literally called **MONOCHROME**: black/white hoodie with reflective lines, "designed to stand out in the light and in the dark" | The UI palette is strictly neutral (black → gray → white). Contrast between light and dark is the main design move. |
| 3D renders: a garment floating inside a soft gray tunnel/portal, vignette, film grain                                                                   | Products live in a "portal" — a soft-lit void with depth, never a flat card with a photo.                           |
| An electric-blue scanline **hologram** of a tee over a near-black navy floor                                                                            | The one brand hue is a light, not a paint: `signal` blue, for glow, 3D lighting and focus only.                     |
| An RGB-split **glitch** on a tee render (magenta/green fringes) during a color reveal                                                                   | Glitch is an allowed transition effect (reveals, variant changes), used sparingly.                                  |
| Nightlife photography: DJ booths, violet neon, flash B&W portraits, sunglasses                                                                          | Editorial/lifestyle photography can carry color (violet neon); the UI never does.                                   |
| Posts are framed by thin outer lines, short centered horizontal rules and `✦` four-point stars around uppercase titles                                  | Thin rules and the `✦` ornament are the structural motifs — not boxes or shadows.                                   |
| Copy is short, Spanish, and ends with a period: "NOTA.", "Espacio Creativo.", "Social.", and the sign-off **"not available."**                          | Voice: terse, declarative, lowercase sign-offs with a period. "not available." is the brand's tagline.              |

**Key Characteristics:**

- **Dark only.** No light theme, no toggle. The floor is the hologram post's near-black (`#06060A`), never pure `#000000`.
- **Monochrome UI.** Neutral grays with no tint; `{colors.primary}` is near-white. Emphasis comes from brightness.
- **One light, `signal` blue.** Used as light (focus rings, glows, small "live" indicators), never as a fill for buttons, badges or text blocks, and never on the garments themselves.
- **One typeface: Jost** — light weights for large text, wide-tracked uppercase for small labels and titles.
- **Thin rules + `✦` stars** instead of shadows or heavy containers.
- **Products are 3D, always**, presented in a portal-like void.
- **Motion is slow and weightless** (GSAP), with glitch as the one sharp exception.

> **Status:** tokens (`app/globals.css`), Jost and dark-only mode are applied, and `components/ui` is restyled to this spec. Still pending: logo vector, motion/3D widgets (`gsap` wrapper, `three` viewer).

## Colors

All values live in `app/globals.css`: primitives and the semantic tokens that alias them, both in `@theme`. Components use the semantic names only, never primitives or raw hex values. There is a single palette — no `.dark` variant, because dark is the only mode. Hex values were sampled from the brand's posts where noted.

| Token                                             | Value                     | Source / use                                                                   |
| ------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| `background`                                      | `#06060A`                 | Sampled from the hologram post's floor. Page floor / scene backdrop            |
| `card`                                            | `#0E0E11`                 | Cards, popovers, panels                                                        |
| `secondary` / `muted`                             | `#16161A`                 | Secondary fills, muted panels, tooltips                                        |
| `accent`                                          | `#1F1F23`                 | Hover/highlight states                                                         |
| `border` / `input`                                | `rgb(242 242 242 / 0.10)` | Every structural hairline and input border                                     |
| `foreground` / `card-foreground` / `*-foreground` | `#F2F2F2`                 | Headings and body — the logo's white, softened                                 |
| `muted-foreground`                                | `#8A8A8A`                 | Sampled from the MONOCHROME renders' mid-gray. Secondary copy, captions        |
| `primary`                                         | `#F2F2F2`                 | Primary action, active state                                                   |
| `primary-foreground`                              | `#06060A`                 | Text on primary                                                                |
| `signal`                                          | `#1E90FF`                 | Hologram blue (sampled halo `#1370BD`, brightened to its core). Glow, 3D light |
| `ring`                                            | `#1E90FF`                 | Focus ring = `signal`                                                          |
| `destructive`                                     | `#E5484D`                 | Destructive actions/states, form errors                                        |
| `destructive-foreground`                          | `#F2F2F2`                 | Text on destructive                                                            |

**Scene-only colors** (3D lights, photography, effects — never UI tokens):

| Name           | Value                 | Source / use                                                       |
| -------------- | --------------------- | ------------------------------------------------------------------ |
| Neon violet    | `#8819D4`             | Sampled from the DJ post. Secondary/fill light in nightlife scenes |
| Glitch fringes | magenta + green split | The tee color-reveal post. Only inside the glitch effect           |
| Portal grays   | `#727272` → `#B4B4B4` | MONOCHROME renders. Studio/portal environment in 3D                |

### Principles

- **Neutral, not tinted.** Grays have no blue/warm cast — the brand is literally monochrome. The near-black floor's faint blue (`#06060A`) is the only exception, and it comes from the hologram post.
- **Light is the accent.** Brighter = more important: `muted-foreground` → `foreground` → `primary` fill. `signal` marks things that are "lit" (focus, a live indicator), not things that are "important".
- **`signal` stays rare.** If more than one or two things on screen glow blue, it's overused.
- **Pure `#000` and `#FFF` are reserved for the logo.**
- **Contrast:** `foreground` and `muted-foreground` on `background`/`card` must meet WCAG AA for their size. `muted-foreground` is for secondary copy only.
- **Status colors** beyond `destructive` are not defined — prefer a neutral message in `foreground` before inventing a green.

## Dark mode

- **Dark is the only mode.** `<html>` sets `color-scheme: dark`; there is no `.dark` class, no `dark:` variants and no theme toggle.
- There is no theme library (`next-themes` was removed); `Toaster` is fixed to `theme="dark"`.
- **Rule:** theme by token, never by class. Don't hard-code `bg-black`, `text-white`, primitives or hex values in components.

## Typography

### Font Family

**Jost** is the only typeface — a geometric sans in the Futura tradition, matching the `NOTA.` wordmark. Loaded with `next/font/google` as a variable font (weights 300–600 in use), exposed as `--font-sans`. Fallback: `ui-sans-serif, system-ui, sans-serif`.

The MONOCHROME post sets its title in a wide, rounded-square sci-fi display face. The site does **not** adopt it: collection titles use `{typography.display}` (Jost, uppercase, open tracking) framed by `✦` stars, which keeps the same feeling with one family. Revisit only if the brand provides that face as an official asset.

### Hierarchy

| Token                    | Classes                                                                         | Size                | Weight | Tracking | Use                                         |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------- | ------ | -------- | ------------------------------------------- |
| `{typography.display}`   | `text-5xl md:text-[88px] font-light uppercase tracking-[0.04em] leading-[0.95]` | 48px → 88px (`md:`) | 300    | 0.04em   | Collection titles (`✦ MONOCHROME ✦`), hero  |
| `{typography.heading-1}` | `text-4xl md:text-5xl font-light tracking-[0.02em]`                             | 36px → 48px         | 300    | 0.02em   | Section headlines, product name on its page |
| `{typography.title}`     | `text-xl font-normal`                                                           | 20px                | 400    | normal   | Product names in grids, card titles         |
| `{typography.eyebrow}`   | `text-xs font-medium uppercase tracking-[0.24em]`                               | 12px                | 500    | 0.24em   | Eyebrows, nav links, labels, button text    |
| `{typography.body}`      | `text-base font-light leading-relaxed`                                          | 16px                | 300    | normal   | Body copy, product descriptions             |
| `{typography.caption}`   | `text-xs tracking-wide`                                                         | 12px                | 400    | 0.04em   | Microcopy, tooltips, legal                  |

### Principles

- **Big and light, small and wide.** Avoid bold (700+) entirely.
- **Few sizes.** If a screen needs a size that isn't in the table, the layout is probably too busy.
- **Prices** use `{typography.title}` with `tabular-nums`.
- **Product descriptions are short and centered** under a thin rule, like the posts — two short paragraphs at most.

### Voice

- Spanish, terse, declarative. Sentences and labels end with a period where it reads naturally ("Social.", "Espacio Creativo.").
- **"not available."** — lowercase, with the period — is the brand's sign-off. Use it as the footer/tagline and for sold-out states, in `{typography.body}` or `{typography.title}`, never uppercase.

## Layout

### Spacing System

- **Base unit**: 4px (Tailwind's default scale).
- **Be generous.** Sections breathe with `py-24`–`py-40`; the 3D object always gets the most space on screen.

### Grid & Container

- Full-bleed scene, contained UI: the three.js canvas spans the viewport; text and controls sit in a `max-w-7xl` container with `px-6 md:px-12` gutters on top of it.
- **Centered, symmetric compositions** for product and collection moments (title on top, object in the middle, description and sign-off below), like the brand's posts. Grids and checkout can be left-aligned.
- Product grids: 1 column on mobile, 2 at `md:`, 3 at `lg:` — never denser.

### Responsive Strategy

- Default Tailwind breakpoints. Mobile is a first-class target (the brand lives on Instagram; most visitors arrive on a phone).

## Elevation & Depth

Depth comes from the scene itself (perspective, the portal's falloff, light), not from shadows. UI layers separate with tint, hairline and blur:

| Level | Treatment                                                            | Use                                                                     |
| ----- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 0     | `{colors.background}`, no border                                     | Page floor / scene backdrop                                             |
| 1     | `{colors.card}` + 1px `{colors.border}`                              | Cards, panels                                                           |
| 2     | `bg-card/60 backdrop-blur-xl` + 1px `{colors.border}`                | UI floating over the 3D canvas (nav, cart drawer, product info overlay) |
| 3     | `{colors.secondary}` + 1px `{colors.border}` + `ring-1 ring-white/5` | Popovers, tooltips, dialogs                                             |

- **No `shadow-*` utilities.**
- **Glow is the only "shadow"**, in `signal`, and only for focus or the currently active/lit object.
- **Film grain:** a very subtle static noise overlay over the whole page is allowed (the renders have it); it must not animate or reduce text contrast.

## Shapes & ornaments

| Token            | Value  | Use                                                   |
| ---------------- | ------ | ----------------------------------------------------- |
| `{rounded.full}` | 9999px | Buttons, inputs, pills, badges, avatars, icon buttons |
| `{rounded.xl}`   | 12px   | Cards, dialogs, drawers' inner panels                 |
| `{rounded.lg}`   | 8px    | Tooltips, popovers, small chrome                      |
| `{rounded.md}`   | 6px    | Checkbox, small form details                          |

- **Thin rules:** 1px `{colors.border}` (or `foreground/40` when it must read) horizontal lines, short (`w-24`) and centered between title / object / description; full-width for section dividers. A thin frame line around a full-screen product moment is allowed.
- **`✦` (four-point star):** flanks collection titles (`✦ MONOCHROME ✦`) and can mark list items. Always `{colors.foreground}`, the size of the cap height. Never more than one pair per screen.

## Motion

GSAP drives all animation (see `FOUNDATIONS.md` → **Wrapping third-party dependencies**). CSS transitions are fine for trivial hover/focus color changes only.

| Token                    | Value          | Use                                                   |
| ------------------------ | -------------- | ----------------------------------------------------- |
| `{motion.duration-fast}` | 0.3s           | Hover, focus, small UI feedback                       |
| `{motion.duration-base}` | 0.6s           | Drawers, dialogs, element entrances                   |
| `{motion.duration-slow}` | 1.2s           | Hero reveals, camera moves, page transitions          |
| `{motion.ease-default}`  | `power3.out`   | Default for everything entering or responding         |
| `{motion.ease-reveal}`   | `expo.out`     | Large reveals (hero text, product entering the scene) |
| `{motion.ease-inout}`    | `power2.inOut` | Camera moves and scroll-scrubbed sequences            |
| `{motion.stagger}`       | 0.06s          | Lists, split-text lines/words                         |

### Principles

- **Weightless, not springy.** Long ease-outs and gentle drift. No `bounce`, `elastic` or `back` eases.
- **Animate `transform` and `opacity` only** (and three.js object/camera/material properties). Never animate layout properties.
- **Typical entrance:** `opacity 0 → 1`, `y 24 → 0` (or `blur(8px) → 0`), `{motion.duration-base}`, `{motion.ease-default}`.
- **Glitch is the signature transition** — a short (≤ 0.4s) RGB-split / slice displacement, used for reveals and color-variant changes (as in the brand's color-reveal post). At most one glitch per interaction; never on text the user is reading.
- **Scroll is a camera, and it's controlled.** Every gesture (wheel, swipe, arrow/page keys) moves exactly one section, starting immediately, in a 0.5s `power2.inOut` scroll; momentum and repeat events from the same gesture are ignored, so nothing moves after the user stops and nothing corrects itself afterwards. The camera is tied to that scroll, so a garment and its information arrive together, and only one garment is ever on screen.
- **Product sections:** one column on phones (garment above, info below); from 768px two columns that alternate per piece (garment left / info right, then the reverse). Usage instructions live in one fixed line at the bottom, never inside product content.
- **`prefers-reduced-motion` is mandatory:** wrap timelines in `gsap.matchMedia()`; under reduced motion use plain fades, no glitch, no scroll-scrubbed camera moves, no ambient drift or auto-rotate.

## 3D

Every product is shown as an interactive three.js object. The canvas is part of the page's space, not a box embedded in it.

- **One space:** the canvas is transparent or clears to `{colors.background}` — never a visible canvas edge or a different-colored stage.
- **Portal staging:** garments float (no mannequin, no floor contact) inside a soft-lit void — a subtle receding frame/tunnel with vignette, as in the MONOCHROME renders. Portal grays come from the scene-only table above.
- **Light:** a neutral key from the front and a neutral (white) back light that rims the garment so black fabric separates from the void. **No `signal`-blue light on garments** (brand decision): `signal` stays for focus and UI light. Reflective details should catch the light as the object turns.
- **Halo:** backlit mist behind each garment, like the decontamination fog of an airlock: a soft radial light in a neutral, slightly cool white (`#e9eef5`, never signal blue) broken up by slowly drifting wisps. Strongest behind black fabric, softest behind white so its edge holds. It doesn't turn with the garment and fades with it; under reduced motion the mist holds still.
- **Decontamination burst:** as the loading gate's doors finish opening, a one-off mist pours out of the seam, spreads across the screen, rises and clears in ~3 s (in the canvas, so page text stays readable). Off under reduced motion.
- **Interaction:** horizontal drag/touch turns the garment with damping (no panning, no zoom). When nobody touches it, it sways gently around its rest view and resumes after a pause. A short caption ("Arrastrá la prenda para girarla.") sits with the product copy.
- **Atmosphere:** two layers of sparse stars at different depths, plus two quiet events, both neutral white and off under reduced motion:
  - **Movement sparkles:** small ✦ that twinkle in and out while the camera travels between sections, in proportion to the distance moved (none at rest).
  - **Shooting stars:** every 6–12 s, at random, 1–3 thin streaks cross the far background in one shared direction (never more than 3).
  - Nothing may compete with the garment.
- **Assets:** the brand's glTF models, optimized with `pnpm models:optimize` (meshopt geometry, WebP textures at 1024px, ~12% of the original vertices): sources in `assets-src/models/` (not served), output in `public/models/` (~0.75–1.2 MB each).
  - Every garment turns a full 360° at one constant pace, and drag turns it freely with inertia.
  - **Hoodie:** its first full turn shows the lights-off model; then a scan line sweeps up and swaps in the lights-on model, whose reflective lines then strike on like a tube light (a short flicker, then steady): only the texture's pure-white texels (the lines, brighter than the off-white fabric) emit, so they read as light against the shaded fabric. No bloom post-processing (it blanked the canvas intermittently).
  - **Tee:** changing colour (Blanca / Negra) uses the same upward scan swap.
- **Loading:** a full-screen hatch, closed, while the garments load. A laser (signal-blue light, white-hot head, sparks) welds its vertical seam top to bottom, following real asset progress with a minimum duration; the status reads "Reparando la compuerta." with a percentage. When the weld completes it flares once, the doors part and the drop is revealed; the finished weld rides away on the left door. Input is held until the doors open. Without WebGL, or after 15 s, it opens anyway; under reduced motion it simply fades. Never a spinner on an empty void.
- **Performance budget:** cap device pixel ratio at 1.5 (an adaptive monitor drops it to 1 when the frame rate falls), render only while the canvas is on screen, pause when the tab is hidden, dispose geometries/materials/textures on unmount.
- **Fallback:** without WebGL, show the poster image — purchasing must never depend on 3D working.
- **Accessibility:** the canvas has a text alternative (product name + short description); every purchase action (size, color, add to cart) lives in regular DOM controls, never only inside the scene.

## Components

### Logo

Observed on the brand's Instagram profile. No vector source yet:

- **Wordmark:** `NOTA.` — all caps, a geometric sans in the Futura/Jost family (circular `O`, pointed `A`, monoline strokes) at a regular-to-light weight with moderate open tracking, closed by a period that is part of the mark.
- **Lockup:** white wordmark centered in a solid black circle (avatar/app-icon form). The brand also uses a plain black circle on its own ("Social." highlight) as a secondary mark.
- **Color:** pure black and white only. On the site it sits directly on `{colors.background}` in `{colors.foreground}`, without the circle; the circle lockup is for favicon/app icon.
- Until a vector file exists, set it in Jost (`font-normal uppercase tracking-[0.08em]`) rather than tracing the bitmap. App icons (`app/favicon.ico`, `public/icon-192.png`, `public/icon-512.png`, `public/maskable-512.png`, `public/apple-icon.png`) are rendered from Jost in the circle lockup; regenerate them once a vector logo exists.

### Buttons

**`button-primary`** — fill `{colors.primary}`, label `{colors.primary-foreground}`, `{rounded.full}`, label in `{typography.eyebrow}`. Hover: slight brightness change. Focus: `signal` ring/glow.

**`button-ghost`** — transparent, 1px `{colors.border}`, `{colors.foreground}` label, `{rounded.full}`. Hover: border to `foreground/40` and `bg-accent/40`.

### Cards

**`card`** — fill `{colors.card}`, 1px `{colors.border}`, `{rounded.xl}`. Product cards are mostly the garment (3D or poster) in its portal; title (`{typography.title}`) and price sit quietly below. Hover: border brightens and the garment turns slightly — no shadow lift. Sold out: "not available." in place of the price.

### Overlays

**`tooltip`** — `{colors.secondary}` fill, `{colors.foreground}` text, `{rounded.lg}`, `{typography.caption}`, hairline border.

Dialogs, drawers (cart) and popovers use elevation level 2–3 and enter with `{motion.duration-base}` + `{motion.ease-default}`.

### Inputs & Forms

- `rounded-full border border-input bg-transparent text-foreground`, no filled background. Sizes match `Button`'s so they line up in a row.
- Hover: border to `foreground/40`; focus: `signal` ring; invalid (`aria-invalid`) `border-destructive`; disabled `opacity-40`.

### Badges

- `rounded-full px-3 py-1` in `{typography.eyebrow}`; outline (hairline) by default. Use wording, not color ("new.", "not available.").

### Other components (nav, cart, checkout, etc.)

- _Not yet defined — extend this section with each component's exact classes as it's built (see `components/ui/<name>/` constants for the source of truth)._

## Do's and Don'ts

### Do

- Let the garment and the empty space do the work.
- Keep the UI monochrome; let `signal` blue appear only as light.
- Use Jost only: light weights large, wide uppercase small.
- Structure with thin rules and the `✦` star; center product moments.
- Keep the canvas and the page one continuous space; stage garments in a portal.
- Use GSAP, keep it weightless, glitch sparingly, honor `prefers-reduced-motion`.
- Write short, with periods; sign off with "not available."

### Don't

- Don't add a light theme, a theme toggle or `dark:` variants.
- Don't use pure black/white outside the logo, tinted grays, or `signal`/violet as a UI fill.
- Don't use drop shadows, bold (700+) weights, decorative gradients or a second typeface.
- Don't use bounce/elastic/back eases, animate layout properties, or glitch text being read.
- Don't show a spinner on an empty canvas, or make purchasing depend on WebGL.
- Don't hard-code hex colours or primitives in components.
