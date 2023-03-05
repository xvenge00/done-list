/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#6fe539",
          "secondary": "#a904ef",
          "accent": "#8309c4",
          "neutral": "#1F2C33",
          "base-100": "#223944",
          "info": "#2651ED",
          "success": "#1CB057",
          "warning": "#AE7804",
          "error": "#E95886",
        },
      },
    ],
  },
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
