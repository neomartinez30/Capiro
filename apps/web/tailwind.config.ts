import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        capiro: {
          blue: "#01226A",
          "blue-light": "#012d8a",
          "blue-dark": "#011a52",
        },
        signal: {
          blue: "#3A6FF7",
          "blue-hover": "#2B5CE0",
          "blue-light": "#E8EFFF",
          "blue-muted": "#3A6FF714",
        },
        cool: {
          grey: "#6B7280",
          "grey-light": "#9CA3AF",
          "grey-dark": "#4B5563",
        },
        soft: {
          white: "#F4F6F8",
          "white-dark": "#E8ECF0",
        },
        status: {
          draft: "#6B7280",
          "draft-bg": "#F3F4F6",
          review: "#D97706",
          "review-bg": "#FEF3C7",
          approved: "#059669",
          "approved-bg": "#D1FAE5",
          submitted: "#3A6FF7",
          "submitted-bg": "#E8EFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInFromLeft: {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
        slideUp: "slideUp 200ms ease-out",
        slideDown: "slideDown 200ms ease-out",
        slideInFromLeft: "slideInFromLeft 200ms ease-out",
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
        "dropdown": "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
