import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import HangarScene from "./hangar-scene";
import { createTurnState } from "./hooks/use-turn-drag";

const meta = {
  title: "Widgets/HangarScene",
  component: HangarScene,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The home's three.js scene (r3f + drei): a depth starfield and the drop's garments floating in zero gravity, with the camera driven by `progressRef` (0 → 1 across the page sections). Drag horizontally to turn a garment. Tees are 2.5D shells inflated from the brand's front and back renders (360°); the hoodie scrubs real footage from its MONOCHROME post (about ±60°, mirrored). Without WebGL it renders the garment poster.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    garments: ["hoodie-monochrome", "tee-monochrome-white"],
    progressRef: { current: 0 },
    turnsRef: { current: [createTurnState(), createTurnState()] },
    reducedMotion: false,
    label: "Hoodie Monochrome y Remera Monochrome flotando en el espacio.",
  },
} satisfies Meta<typeof HangarScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hatch: Story = {};

export const FirstPiece: Story = {
  args: { progressRef: { current: 1 / 3 } },
};

export const BlackTee: Story = {
  args: { garments: ["tee-monochrome-black"] },
};

export const ReducedMotion: Story = {
  args: { reducedMotion: true },
};
