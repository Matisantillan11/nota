---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Home (`/`)

Mode: Persuade. Audience: NOTA. followers arriving from Instagram on a phone, wanting a piece from the live drop before it sells out. Action: buy (add to cart) a live-drop garment. Proof: the garment itself, inspectable in 3D; no invented claims, prices are placeholders until real ones exist.

## Direction contract

THESIS: The home is a ship's hatch opening onto zero gravity: the live drop's garments float in deep space and you buy them there. It refuses the category default of hero banner + product grid.

OWN-WORLD: Near-black void (#06060a) with layered depth starfield, a hairline hatch/portal frame, garments as lit 3D objects the visitor can turn, rimmed by a neutral back light (no blue on garments, per the brand), Jost light display with tracked uppercase UI labels (no eyebrow above headings), capsule CTA that goes from hairline "Elegí un talle" to near-white "Agregar al carrito", thin centered rules and ✦. No cards, no shadows.

STORY: Visitor lands inside the hatch, sees the live drop floating, understands "Drop 01 · Live", can buy immediately; scrolling flies the camera through the drop piece by piece (each with price, sizes, add), then the next drop is announced (Drop 01 is the first drop: there are no past drops yet; sold-out pieces will read "not available.").

FIRST VIEWPORT: Full-bleed starfield; hatch frame centered, doors parted; the hoodie floating and slowly turning at the center (~45% of viewport height); NOTA. top-left, Carrito top-right; bottom dock centered: ✦ MONOCHROME ✦ display, rule, subline "Drop 01 en vivo. Hoodie Monochrome.", price line, size picker, capsule CTA.

FORM: Zero-g hangar, #4 of 7 on the ordered list. seed:24c0663b8bdb93d4. Signature interaction: hatch doors slide open on load, then each scroll gesture advances one section (directional snap) and the camera makes a fixed ~0.8s trip to it, one garment on screen at a time; pointer gives gentle zero-g drift; horizontal drag turns each garment (tees 360° as 2.5D shells from front/back renders, hoodie ±60° from its real footage). Product sections are centred: garment above, its information directly below.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open decisions
- Real prices, sizes, stock, checkout provider; currency selection ARS/USD.
- Real .glb models (procedural placeholders until then).
