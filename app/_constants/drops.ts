import type { Drop } from "~/app/_types/drop";

// Placeholder catalog built only from the brand's Instagram posts. Sizes and
// prices are not confirmed yet (PRODUCT.md → Capabilities and Constraints);
// replace with commerce data when the backend exists.
export const LIVE_DROP: Drop = {
  id: "monochrome",
  number: "01",
  name: "Monochrome",
  status: "live",
  pieces: [
    {
      id: "monochrome-hoodie",
      name: "Hoodie Monochrome",
      description:
        "Dos líneas de material reflectivo que recorren a lo largo del cuerpo, dando una sensación de movimiento única. Diseñado para destacar, tanto en la luz como en la oscuridad.",
      variants: [
        { id: "monochrome", label: "Monochrome", model: "hoodie-monochrome" },
      ],
      sizes: ["S", "M", "L", "XL"],
      price: null,
      available: true,
    },
    {
      id: "monochrome-tee",
      name: "Remera Monochrome",
      description:
        "Corte amplio con costuras en contraste, «not available.» en el pecho y la marca en la espalda.",
      variants: [
        { id: "blanca", label: "Blanca", model: "tee-monochrome-white" },
        { id: "negra", label: "Negra", model: "tee-monochrome-black" },
      ],
      sizes: ["S", "M", "L", "XL"],
      price: null,
      available: true,
    },
  ],
};

export const NEXT_DROP = {
  number: "02",
  message: "Pronto.",
} as const;
