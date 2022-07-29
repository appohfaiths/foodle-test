/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '0rem',
          sm: '0rem',
          md: '1rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
};
