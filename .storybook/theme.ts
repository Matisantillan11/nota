import { create } from "storybook/theming";

// Storybook's UI can't read CSS variables, so these mirror app/globals.css — keep in sync.
export const notaTheme = create({
  base: "dark",
  brandTitle: "NOTA.",
  fontBase: '"Jost", ui-sans-serif, system-ui, sans-serif',
  appBg: "#0e0e11",
  appContentBg: "#06060a",
  appPreviewBg: "#06060a",
  appBorderColor: "rgba(242, 242, 242, 0.1)",
  barBg: "#0e0e11",
  textColor: "#f2f2f2",
  textMutedColor: "#8a8a8a",
  colorSecondary: "#1e90ff",
});
