/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
// @ts-check

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
      },
      fontFamily: {
        mono: ["var(--font-inconsolata)", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
