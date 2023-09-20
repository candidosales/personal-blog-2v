/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inclusive: ["Inclusive Sans", "Inter", ...defaultTheme.fontFamily.sans],
        calligraffitti: [
          "'Calligraffitti', cursive",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
