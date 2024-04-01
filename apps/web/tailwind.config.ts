import headlessuiPlugin from "@headlessui/tailwindcss";
import forms from "@tailwindcss/forms";
import typographyPlugin from "@tailwindcss/typography";
import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

import typographyStyles from "./typography";

export default {
  trailingSlash: true,
  content: [
    // app content
    "./app/**/*.{js,mjs,jsx,ts,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,mjs,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,mjs,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,mjs,jsx,ts,tsx,mdx}",
    "./mdx/**/*.{js,mjs,jsx,ts,tsx,mdx}",
    // include packages if not transpiling
    "../../packages/ui/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    fontSize: {
      "2xs": ["0.75rem", { lineHeight: "1.25rem" }],
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "2rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "2rem" }],
      "2xl": ["1.5rem", { lineHeight: "2.5rem" }],
      "3xl": ["2rem", { lineHeight: "2.5rem" }],
      "4xl": ["2.5rem", { lineHeight: "3rem" }],
      "5xl": ["3rem", { lineHeight: "3.5rem" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    typography: typographyStyles,
    extend: {
      boxShadow: {
        glow: "0 0 4px rgb(0 0 0 / 0.1)",
      },
      dropShadow: {
        card: "0px 4px 12px rgba(0, 0, 0, 0.5);",
      },
      maxWidth: {
        lg: "33rem",
        "2xl": "40rem",
        "3xl": "50rem",
        "5xl": "66rem",
        "8xl": "88rem",
      },
      colors: {
        brand: {
          DEFAULT: "#7b4cfa",
          light: "#7b4cfa",
          dark: "#7b4cfa",
        },

        black: {
          DEFAULT: "#0F172A",
        },
        cta: { DEFAULT: "#bef264" },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
          950: "#1a2e05",
        },
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        display: ["Lexend", ...defaultTheme.fontFamily.sans],
        kablammo: ["Kablammo", "sans"],
      },
      screens: {
        xs: "430px",
      },
      opacity: {
        1: "0.01",
        2.5: "0.025",
        7.5: "0.075",
        15: "0.15",
      },
    },
  },
  plugins: [typographyPlugin, headlessuiPlugin, forms],
} satisfies Config;
