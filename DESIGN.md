---
version: alpha
name: Spar - Nextjs Boilerplate
description: A warm, editorial surface built around a single confident black accent on off-white/clay neutrals, never pure white or cool gray. Space Grotesk carries headings and UI chrome, Inter rides underneath as body/fallback. Structure is communicated through a warm tint ladder (background → card → border) rather than shadows, while a real, confirmed shadow system exists one layer up for floating and overlay surfaces (tooltips, popovers, the chat widget, modals). Card geometry is generously rounded (2xl), buttons stay closer to the ground (md), and pills/avatars/progress go fully round.

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
  destructive: "var(--color-destructive)"
  destructive-foreground: "var(--color-destructive-foreground)"
  border: "var(--color-border)"
  input: "var(--color-input)"
  ring: "var(--color-ring)"

typography:
  heading-1:
    fontFamily: "Space Grotesk"
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Space Grotesk"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.3
  label:
    fontFamily: "Space Grotesk"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  full: 9999px

spacing:
  unit: 4px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "12px 32px"
  card:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.border}"
    rounded: "{rounded.2xl}"
  tooltip:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.xl}"
---

## Overview

The background itself is warm — a clay/cream off-white (`{colors.background}` — `var(--color-background)`), never pure white or neutral gray — with a single confident black (`{colors.primary}` — `var(--color-primary)`) doing all of the brand's emphasis work. There is no secondary "commercial accent" hue the way many systems reserve a second color for badges or savings callouts: black is the only accent signal, used for primary actions, active/hover states, and chart emphasis alike.

Two typefaces carry the whole UI: **Space Grotesk** for headings and UI labels, **Inter** underneath for body copy, both self-hosted via Google Fonts at confirmed weight ranges (Space Grotesk 400–700, Inter 300–600). Card geometry is generously rounded (`{rounded.2xl}`, 16px) — noticeably softer than the buttons sitting inside those cards, which stay closer to the ground at `{rounded.md}` (6px). Pills, avatars, and progress indicators go fully round.

Elevation is not shadow-free the way some monochrome systems are: resting cards get a light `shadow-sm`, hover lifts to `shadow-md`, and floating/overlay surfaces (tooltips, popovers, the chat widget panel, modals) commit to `shadow-lg`–`shadow-2xl`. Day-to-day layout hierarchy, though, still leans first on the warm neutral ladder (background → card → border) before reaching for a shadow.

**Key Characteristics:**

- Warm off-white/clay background (`var(--color-background)`), never pure white or cool gray — the palette's defining trait
- One black accent (`{colors.primary}`) for every emphasis need; no second "commercial" hue
- Space Grotesk headings over an Inter body/fallback, both self-hosted
- Card radius (`{rounded.2xl}`, 16px) is deliberately softer than button radius (`{rounded.md}`, 6px)
- Real, confirmed shadow ladder for floating/overlay surfaces — not a shadow-free system
- Destructive state uses a single confirmed red (`{colors.destructive}` — `var(--color-destructive)`); no confirmed warning/success/info colors on the public marketing site

## Colors

All values live in `app/globals.css`: primitives (`--color-base-*`, `--color-gray-*`, `--color-text-*`, …) and the semantic tokens that alias them, both in `@theme`. Components use the semantic names only, never primitives or raw hex values.

| Token                            | Light     | Dark    | Use                                         |
| -------------------------------- | --------- | ------- | ------------------------------------------- |
| `background`                     | `#FFFFFF` | pending | Page floor                                  |
| `card`                           | `#F9F7F6` | pending | Cards, popovers                             |
| `secondary` / `muted`            | `#F2F0ED` | pending | Secondary buttons, muted panels             |
| `accent`                         | `#E8E3DE` | pending | Hover/highlight states                      |
| `border` / `input`               | `#DBD3CC` | pending | Every structural line and input border      |
| `foreground` / `card-foreground` | `#27211B` | pending | Headings and body                           |
| `muted-foreground`               | `#756252` | pending | Secondary copy, captions                    |
| `primary` / `ring`               | `#000000` | pending | Primary action, active state, focus         |
| `primary-foreground`             | `#FFFFFF` | pending | Text on primary                             |
| `destructive`                    | `#D32222` | pending | Destructive actions/states                  |

> **Known mismatch:** the prose below describes a warm clay `background` with a _lighter_ `card`, but `globals.css` currently ships `background` = pure white and `card` = warm `#F9F7F6` (darker than the page). Decide which is the truth and fix the other.

### Brand

- **Primary** (`{colors.primary}` — `var(--color-primary)`): The brand color and only accent. Fills primary CTAs, active/hover indicators, and the chart-emphasis palette.
- **Primary Foreground** (`{colors.primary-foreground}` — `var(--color-primary-foreground)`): Text/icon color on top of primary fills.

### Surface

- **Background** (`{colors.background}` — `var(--color-background)`): Page background. A warm clay off-white — the single biggest tell that this isn't a generic SaaS gray/white system.
- **Card** (`{colors.card}` — `var(--color-card)`): Card and popover fill. Notably _lighter_ than the page background rather than darker — cards sit as a bright plane on a warm floor, the inverse of the more common "card slightly darker than page" convention.
- **Secondary** / **Muted** / **Accent** (`{colors.secondary}` / `{colors.muted}` / `{colors.accent}` — `var(--color-secondary)` / `var(--color-muted)` / `var(--color-accent)`): Subtle fills for secondary buttons, muted panels, and hover/highlight states — not yet independently confirmed brand truth beyond what's implemented in `app/globals.css`.
- **Border** / **Input** (`{colors.border}` / `{colors.input}` — `var(--color-border)` / `var(--color-input)`): The one confirmed border/divider tone, reused for input borders too. No second soft/strong hairline tier was observed — a single border weight does the job everywhere from cards to inputs.

### Text

- **Foreground** (`{colors.foreground}` — `var(--color-foreground)`): Headings and primary body text. A warm near-black, not neutral.
- **Muted Foreground** (`{colors.muted-foreground}` — `var(--color-muted-foreground)`): Secondary copy, captions, supporting text.
- **Card Foreground** / **Secondary Foreground** / **Accent Foreground** (`{colors.card-foreground}` / `{colors.secondary-foreground}` / `{colors.accent-foreground}` — `var(--color-card-foreground)` / `var(--color-secondary-foreground)` / `var(--color-accent-foreground)`): Same warm near-black as `foreground`, used for text sitting on `card`/`secondary`/`accent` fills.

### Semantic

- **Destructive** (`{colors.destructive}` — `var(--color-destructive)`): The one confirmed semantic color on the public marketing site (destructive actions/states).
- **Destructive Foreground** (`{colors.destructive-foreground}` — `var(--color-destructive-foreground)`): Text/icon color on top of destructive fills.
- **Ring** (`{colors.ring}` — `var(--color-ring)`): Focus ring color, aliased to `primary`.
- No warning, success, info surfaces. This codebase (`app/globals.css`) extends the palette with muted warning/success/blue/aqua scales in the same warm, desaturated character for future in-app UI (dashboards, forms) — treat those as this codebase's extension, not scraped brand truth.

## Dark mode

- **Mechanism:** `next-themes` (`ThemeProvider` in `providers/theme-provider/`, `attribute="class"`, `defaultTheme="system"`, light/dark/system available) toggles `.dark` on `<html>`. `ThemeToggle` (`components/theme-toggle/`) is the switch.
- **Status:** `app/globals.css` has **no `.dark` block yet** — every token in the Colors table above is light-only, so dark mode currently renders the light palette. Next step: add a `.dark` block redefining the semantic tokens (keep the warm character — warm near-black floor, not neutral gray) plus `@custom-variant dark (&:where(.dark, .dark *))` so `dark:` follows the chosen theme instead of the OS media query, and `color-scheme: dark`.
- **Rule:** theme by token, not by class. Components shouldn't need `dark:` variants — if something looks wrong in dark mode, fix the token in `.dark`. `dark:` is acceptable only for a one-off with no token (e.g. an illustration).
- **Elevation in dark:** shadows alone disappear on a dark floor — floating layers should add a subtle light 1px ring (e.g. `rgb(255 255 255 / 0.04–0.06)`) to separate from the page.

## Typography

### Font Family

**Space Grotesk** carries headings and UI labels; **Inter** rides underneath as body copy and as the fallback if Space Grotesk fails to load (`"Space Grotesk", "Inter", sans-serif`). Both are self-hosted via Google Fonts, confirmed at Space Grotesk 400/500/600/700 and Inter 300/400/500/600. Neither is a generic system-font stack — this is a deliberate two-typeface pairing, not one family doing everything.

### Hierarchy

Confirmed combinations observed directly in the production bundle (not the full generic Tailwind scale — only what's actually used):

| Token                    | Classes                                                | Size                | Weight | Tracking | Use                           |
| ------------------------ | ------------------------------------------------------ | ------------------- | ------ | -------- | ----------------------------- |
| `{typography.heading-1}` | `text-4xl md:text-6xl font-bold tracking-tighter`      | 36px → 60px (`md:`) | 700    | tighter  | Page hero headline            |
| `{typography.title}`     | `text-lg font-bold`                                    | 18px                | 700    | normal   | Card/feature titles           |
| `{typography.label}`     | `text-sm font-semibold`                                | 14px                | 600    | normal   | Nav wordmark, small UI labels |
| `{typography.body}`      | `text-lg`                                              | 18px                | 400    | normal   | Lead/body paragraphs          |
| `{typography.caption}`   | `text-xs`                                              | 12px                | 400    | normal   | Tooltip/badge microcopy       |

### Principles

- **Weight, not size, does most of the emphasis work** below the hero — a `700` title next to `400` body at similar sizes reads as hierarchy without reaching for a bigger font size.
- **Tighter tracking on the hero only** — `tracking-tighter` appears on the large headline; smaller text runs at normal tracking.

## Layout

### Spacing System

- **Base unit**: 4px (Tailwind's default scale) — confirmed token, no custom named spacing scale.

### Grid & Container

- _Not yet defined — pending closer study of the live site's section/grid structure beyond individual component classes._

### Responsive Strategy

- Default Tailwind breakpoints, no custom overrides detected in the compiled CSS.
- `md:` is the confirmed primary responsive prefix in use (e.g. the hero headline steps from 36px to 60px at `md:`).
- Full breakpoint-by-breakpoint behavior: _not yet defined._

## Elevation & Depth

| Level   | Treatment                                              | Use                                               |
| ------- | ------------------------------------------------------ | ------------------------------------------------- |
| 0       | Flat, no shadow                                        | Default page content                              |
| 1       | `shadow-sm`                                            | Resting cards                                     |
| 2       | `shadow-md`                                            | Card hover state (lifts on interaction)           |
| 3       | `shadow-lg`                                            | Floating action button (chat launcher)            |
| 4       | `shadow-xl` / `shadow-2xl`                             | Tooltips, popovers, modals, the chat widget panel |
| Inverse | `{colors.foreground}` fill, `{colors.background}` text | Tooltips (dark chip on light page)                |

Confirmed via `shadow-*` utility classes in the production bundle — this is a real, deliberate elevation ladder, not a shadow-free system. Day-to-day section/card hierarchy still leans on the warm neutral ladder (background → card → border) before reaching for a shadow; shadows are reserved for things that float above the page (overlays, hover lifts, the FAB).

## Shapes

### Border Radius Scale

Confirmed by usage frequency in the production bundle (most‑used first):

| Token            | Value  | Use                                                                                          |
| ---------------- | ------ | -------------------------------------------------------------------------------------------- |
| `{rounded.full}` | 9999px | Pills, avatars, progress bars, toggle switches, the chat FAB — the single most common radius |
| `{rounded.2xl}`  | 16px   | Cards, feature tiles, modals, the chat widget panel — the standard "card" radius             |
| `{rounded.xl}`   | 12px   | Secondary tiles, tooltips/popovers                                                           |
| `{rounded.lg}`   | 8px    | Badges/tags, smaller chrome                                                                  |
| `{rounded.md}`   | 6px    | Buttons, form inputs                                                                         |
| `{rounded.sm}`   | 4px    | Fine details (least common)                                                                  |

Notably, buttons (`{rounded.md}`) are meaningfully less rounded than the cards they sit inside (`{rounded.2xl}`) — a deliberate two-tier geometry rather than one radius reused everywhere.

## Components

### Logo

Confirmed markup (source of truth, `public/brand/spar-symbol.svg`, not reverse-engineered):

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <title>Spar logo</title>
  <path
    d="M128,30 A72,49 0 0,0 128,128 A72,49 0 0,1 128,226"
    fill="none"
    stroke="#000000"
    stroke-width="46"
    stroke-linecap="square"
  />
</svg>
```

A single continuous stroke forming an "S" spiral mark (ink/black, `#FFFFFF` on dark surfaces), paired with an uppercase **SPAR** wordmark set in Space Grotesk 700 at tight tracking. Delivered as standalone assets in `public/brand/` — `spar-symbol(-white).svg` (mark only), `spar-horizontal(-white).svg` (mark + wordmark, lockup), `spar-stacked(-white).svg` (mark over wordmark), and `spar-app-icon.svg` (mark inset in a rounded black square, favicon/app icon). `app/icon.svg` and `public/logo-mark.svg` mirror the same mark.

### Buttons

**`button-primary`**

- Fill `{colors.primary}`, label `{colors.primary-foreground}`, shape `{rounded.md}` (shadcn `Button` base chrome: `text-sm font-medium`, focus ring)
- Confirmed padding variants: `px-8 py-3` (standard CTA), `h-12` + `text-base` (larger hero CTA)

### Cards

**`card`**

- Fill `{colors.card}`, 1px `{colors.border}` border, shape `{rounded.2xl}`
- Confirmed padding variants: `p-6`, `p-7`, `px-8 py-7`
- Hover state adds a `{colors.primary}`-tinted border and, on some tiles, lifts from `shadow-sm` to `shadow-md`

### Overlays

**`tooltip`**

- Inverse fill (`{colors.foreground}` background, `{colors.background}` text), `{rounded.xl}`, `shadow-xl`, `{typography.caption}` text
- The chat widget panel and modals follow the same inverse-elevation logic at `{rounded.2xl}` and `shadow-2xl`

### Inputs & Forms

- `rounded-md border border-input bg-transparent text-foreground` — no filled input background. Sizes track `Button`'s (`sm` `h-9 px-3 text-xs`, default `h-10 px-4 text-sm`, `lg` `h-12 px-4 text-base`) so an input and a button of the same size line up in a row.
- Hover and focus `border-primary`; invalid (`aria-invalid`) `border-destructive` with a destructive focus outline; disabled `opacity-50`.

### Badges

- `rounded-full px-2.5 py-0.5 text-xs font-medium`, `size-3` icons. Variants: `primary` (`bg-primary`), `secondary` (`bg-secondary`), `destructive`, `outline` (`border-foreground/30`, transparent fill).

### Other components (nav, data tables, etc.)

- _Not yet defined — extend this section with each component's exact classes as it's built (see `components/ui/<name>/` constants for the source of truth)._

## Do's and Don'ts

### Do

- Keep the background warm (`{colors.background}` clay off-white) — never drop to pure white or neutral gray as the page background.
- Reserve `{colors.primary}` as the only chromatic accent; don't introduce a second "commercial" hue for badges/callouts.
- Round cards more than buttons — `{rounded.2xl}` containers holding `{rounded.md}` actions, not one radius reused everywhere.
- Use the shadow ladder (`shadow-sm` → `shadow-2xl`) for things that float above the page; use the neutral tint ladder for everyday section/card hierarchy.
- Pair Space Grotesk (headings/labels) with Inter (body) — don't collapse to a single family.
- Theme with semantic tokens; check every new screen in light **and** dark.

### Don't

- Don't use pure white/gray surfaces — the warm clay background is the brand's most identifiable trait.
- Don't invent a second accent hue for emphasis; black carries every "look here" moment.
- Don't apply `{rounded.full}` to cards or `{rounded.2xl}` to buttons — the two-tier radius system is deliberate.
- Don't assume this is a shadow-free system — overlays and hover states have a real, confirmed elevation ladder.
- Don't hard-code `bg-white`, `text-black`, primitives or hex colours in components; they break dark mode.
