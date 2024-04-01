module.exports = {
  content: [
    // app content
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    // include packages if not transpiling
    "../../packages/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        shake: "shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        brand: {
          DEFAULT: "#7b4cfa",
          light: "#7b4cfa",
          dark: "#7b4cfa",
        },
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
          DEFAULT: "#bef264",
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
        focus: "var(--typeflowai-focus, #1982fc)",
        error: "var(--typeflowai-error, #d13a3a)",
        brandnew: "var(--typeflowai-brand, #7b4cfa)",
        borderColor: {
          primary: "var(--typeflowai-border-primary, #e0e0e0)",
          secondary: "var(--typeflowai-border-secondary, #0f172a)",
          disabled: "var(--typeflowai-border-disabled, #ececec)",
          error: "var(--typeflowai-error, #d13a3a)",
        },
        labelColor: {
          primary: "var(--typeflowai-label-primary, #0f172a)",
          secondary: "var(--typeflowai-label-secondary, #384258)",
          disabled: "var(--typeflowai-label-disabled, #bdbdbd)",
          error: "var(--typeflowai-error, #d13a3a)",
        },
        fill: {
          primary: "var(--typeflowai-fill-primary, #fefefe)",
          secondary: "var(--typeflowai-fill-secondary, #0f172a)",
          disabled: "var(--typeflowai-fill-disabled, #e0e0e0)",
          error: "var(--typeflowai-error, #d13a3a)",
        },
      },
      fontSize: {
        sm: "0.9rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },

          "20%, 80%": {
            transform: "translate3d(2px, 0, 0),",
          },

          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },

          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      maxWidth: {
        "8xl": "88rem",
      },
      screens: {
        xs: "430px",
      },
      scale: {
        97: "0.97",
      },
      gridTemplateColumns: {
        20: "repeat(20, minmax(0, 1fr))",
      },
    },
  },
  safelist: [{ pattern: /max-w-./, variants: "sm" }],
  darkMode: "class", // Set dark mode to use the 'class' strategy
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
