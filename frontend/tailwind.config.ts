import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stokvel: {
          50: "#f0fdf6",
          100: "#dcfce9",
          200: "#bbf7d3",
          300: "#86efb3",
          400: "#4ade8c",
          500: "#22c26d",
          600: "#16a35a",
          700: "#15804a",
          800: "#166540",
          900: "#145337",
        },
      },
    },
  },
  plugins: [],
};

export default config;
