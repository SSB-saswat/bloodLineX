/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#C51605",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

// corePlugins is used to so that tailwindcss doesnt override antd desing or default css
