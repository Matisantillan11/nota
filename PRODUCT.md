# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who follow NOTA. (mostly arriving from Instagram, on a phone) and want to buy a piece from a limited drop before it sells out. Buyers are in Argentina and abroad.

## Product Purpose

The online store for NOTA., a small creative studio ("Espacio Creativo.") that designs apparel — tees and hoodies so far. It lets visitors see each garment as an interactive 3D object and buy it while the drop is live. Success: a drop sells through, and the store feels like an extension of the brand's world rather than a generic shop.

## Positioning

Products are released as **limited drops** (collections such as MONOCHROME). Stock is finite; once a piece sells out it stays visible as "not available." — scarcity is part of the brand, not an error state. Garments are presented in 3D, as the brand already does on Instagram.

## Operating Context

- Traffic comes mainly from Instagram (`@nota__studio_`), so mobile is the primary viewport.
- Two markets: Argentina (prices in ARS) and international (prices in USD).
- Each drop has a name, a short description and a small set of garments.

## Capabilities and Constraints

- Next.js app (App Router), Tailwind, three.js for product viewing, GSAP for motion.
- **Undecided:** commerce backend/checkout provider, payment methods, shipping rules, drop schedule, sizing, and real prices. No backend exists yet; UI uses placeholder data marked as such.
- **Undecided:** how a visitor's market/currency is chosen (geo, toggle, or both).

## Brand Commitments

- Name: **NOTA.** (with the period). Bio: "Espacio Creativo." Founders: Ivo Romero and Matías Santillán.
- Logo: `NOTA.` wordmark, white on a black circle.
- Voice: Spanish, terse, sentences end with a period. "not available." (lowercase) is the brand sign-off.
- Visual identity is recorded in `DESIGN.md`.

## Evidence on Hand

- Instagram posts (6): MONOCHROME hoodie (black/white with reflective lines; copy: "Dos líneas de material reflectivo que recorren a lo largo del cuerpo, dando una sensación de movimiento única. Diseñado para destacar, tanto en la luz como en la oscuridad."), a white tee shown as a blue hologram and in a color-version reveal, and nightlife/DJ photos wearing the pieces.
- No product photography, 3D models, prices, testimonials, press or sales numbers are in the repo. Do not fabricate them; placeholders must be obviously placeholders.

## Product Principles

1. The garment is the hero; everything else gets out of its way.
2. Scarcity is honest: show what's live, what's coming, and what's gone ("not available.") — never fake urgency.
3. Buying must work without 3D/WebGL; 3D is the experience, not a dependency.
4. Mobile first — the visitor came from Instagram.
5. Say less. Every word earns its place.
