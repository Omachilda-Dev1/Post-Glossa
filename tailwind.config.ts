import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fff3ee",
          100: "#ffe4d5",
          200: "#ffc4a0",
          300: "#ff9a60",
          400: "#ff6a25",
          DEFAULT: "#f54300",
          600: "#d93a00",
          700: "#b53000",
          800: "#501907",
          900: "#3a1005",
          950: "#200800",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(245,67,0,0.2) 0%, transparent 65%)",
        "brand-gradient": "linear-gradient(135deg, #f54300 0%, #ff6a25 100%)",
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "var(--font-inter)",
            maxWidth: "none",
            h1: { fontFamily: "var(--font-playfair)" },
            h2: { fontFamily: "var(--font-playfair)" },
            h3: { fontFamily: "var(--font-playfair)" },
            "code::before": { content: '""' },
            "code::after":  { content: '""' },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
