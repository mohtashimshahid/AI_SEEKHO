import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#ceddce",
          300: "#a7c3a7",
          400: "#7aa47a",
          500: "#578557",
          600: "#436943",
          700: "#365336",
          800: "#2d432d",
          900: "#273827",
          950: "#131f13",
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        sand: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#ebe1d1",
          900: "#1c1917",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
