import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      tan: "#D8C1AC",
      black: "#07090F",
      yellow: "#D29B31",
      green: "#458A2D",
      red: "#BF211E",
      blue: "#4E68C6",
    },
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-owners)"],
        display: ["var(--font-gabriella)"],
      },
      flexBasis: {
        half: "calc(50%-16px)",
        third: "calc(33.333333333333%-32px)",
      },
      spacing: {
        "128": "26rem",
      },
      borderWidth: {
        "6": "6px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
