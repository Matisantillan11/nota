import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

import { Jost } from "next/font/google";
import { notaTheme } from "./theme";

// next/font only sets --font-jost where its class is applied; app/layout.tsx does it for the app, this does it for stories.
const jost = Jost({ variable: "--font-jost", subsets: ["latin"] });

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className={`${jost.variable} font-sans`}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: { theme: notaTheme },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Foundations", "UI"],
      },
    },
  },
};

export default preview;
