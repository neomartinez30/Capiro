/**
 * Capiro brand design tokens.
 *
 * These constants define the visual identity of the Capiro platform
 * and should be used as the single source of truth for colors,
 * typography, and spacing across all applications.
 */

// ── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  /** Primary brand blue — used for primary actions and key UI elements */
  capiroBlue: {
    50: "#EBF0FF",
    100: "#D6E0FF",
    200: "#ADC1FF",
    300: "#85A3FF",
    400: "#5C84FF",
    500: "#1B4DFF",
    600: "#153DCC",
    700: "#102E99",
    800: "#0A1E66",
    900: "#050F33",
    DEFAULT: "#1B4DFF",
  },

  /** Signal blue — used for interactive and informational highlights */
  signalBlue: {
    50: "#E6F4FF",
    100: "#CCE9FF",
    200: "#99D3FF",
    300: "#66BDFF",
    400: "#33A7FF",
    500: "#0091FF",
    600: "#0074CC",
    700: "#005799",
    800: "#003A66",
    900: "#001D33",
    DEFAULT: "#0091FF",
  },

  /** Cool gray — used for text, borders, and neutral surfaces */
  coolGray: {
    50: "#F8F9FA",
    100: "#F1F3F5",
    200: "#E9ECEF",
    300: "#DEE2E6",
    400: "#CED4DA",
    500: "#ADB5BD",
    600: "#868E96",
    700: "#495057",
    800: "#343A40",
    900: "#212529",
    DEFAULT: "#ADB5BD",
  },

  /** Soft white — used for backgrounds and elevated surfaces */
  softWhite: {
    50: "#FFFFFF",
    100: "#FDFDFE",
    200: "#FAFBFC",
    300: "#F5F7F9",
    400: "#F0F2F5",
    500: "#EBEEF2",
    DEFAULT: "#FAFBFC",
  },

  /** Semantic colors */
  success: "#12B76A",
  warning: "#F79009",
  error: "#F04438",
  info: "#0091FF",
} as const;

// ── Typography ──────────────────────────────────────────────────────────────

export const fonts = {
  /** Primary font family for all UI text */
  sans: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  /** Monospace font for code and data displays */
  mono: [
    "JetBrains Mono",
    "Fira Code",
    "Consolas",
    "Monaco",
    "Courier New",
    "monospace",
  ],
} as const;

// ── Spacing ─────────────────────────────────────────────────────────────────

export const spacing = {
  /** Page-level horizontal padding */
  pagePadding: "1.5rem",
  /** Standard sidebar width */
  sidebarWidth: "16rem",
  /** Collapsed sidebar width */
  sidebarCollapsedWidth: "4rem",
  /** Top navigation bar height */
  navHeight: "3.5rem",
  /** Standard content max-width */
  contentMaxWidth: "80rem",
  /** Card border radius */
  cardRadius: "0.75rem",
  /** Button border radius */
  buttonRadius: "0.5rem",
  /** Input border radius */
  inputRadius: "0.5rem",
} as const;
