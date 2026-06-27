import { createTheme, type MantineColorsTuple } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#E8F1FF", // 0 - accentSoft
  "#CCE0FF",
  "#99C1FF",
  "#66A3FF",
  "#3384FF",
  "#0A84FF", // 5 - accent (primary)
  "#0070E0",
  "#005BBF",
  "#00469F",
  "#00317F", // 9
];

const gray: MantineColorsTuple = [
  "#F7F7F8", // 0 - surface
  "#EFEFF0", // 1
  "#E5E5EA", // 2 - border
  "#D8D8DD", // 3 - borderStrong
  "#B8B8BD", // 4
  "#9A9AA0", // 5 - text muted
  "#6B6B70", // 6 - text secondary
  "#48484C", // 7
  "#2A2A2D", // 8
  "#111111", // 9 - text primary
];

const success: MantineColorsTuple = [
  "#E8F8EC",
  "#D0F0D9",
  "#A1E1B3",
  "#72D18D",
  "#43C267",
  "#34C759",
  "#28A048",
  "#1f8a3a",
  "#166030",
  "#0D3D1E",
];

const warning: MantineColorsTuple = [
  "#FFF8DC",
  "#FFF0B3",
  "#FFE47A",
  "#FFD840",
  "#FFCC00",
  "#E8B800",
  "#C49C00",
  "#8a6d00",
  "#664F00",
  "#443300",
];

const FONT_FAMILY =
  "'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const theme = createTheme({
  fontFamily: FONT_FAMILY,
  headings: {
    fontFamily: FONT_FAMILY,
    sizes: {
      h1: { fontSize: "24px", fontWeight: "600", lineHeight: "1.2" },
      h2: { fontSize: "18px", fontWeight: "600", lineHeight: "1.3" },
      h3: { fontSize: "15px", fontWeight: "600", lineHeight: "1.4" },
    },
  },
  fontSizes: {
    xs: "11px",
    sm: "13px",
    md: "15px",
    lg: "18px",
    xl: "24px",
  },
  radius: {
    xs: "6px",
    sm: "8px",
    md: "10px",
    lg: "12px",
    xl: "999px",
  },
  defaultRadius: "md",
  white: "#FFFFFF",
  black: "#111111",
  colors: {
    brand,
    gray,
    success,
    warning,
  },
  primaryColor: "brand",
  primaryShade: 5,
  shadows: {
    xs: "0 1px 2px rgba(0,0,0,0.08)",
    sm: "0 2px 8px rgba(0,0,0,0.10)",
    md: "0 4px 16px rgba(0,0,0,0.12)",
    lg: "0 8px 32px rgba(0,0,0,0.16)",
    xl: "0 24px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.04)",
  },
  components: {
    Card: {
      defaultProps: { radius: "lg", withBorder: true, padding: "xl" },
    },
    Paper: {
      defaultProps: { radius: "lg", withBorder: true },
    },
    Modal: {
      defaultProps: { radius: "lg", shadow: "xl" },
    },
  },
});
