/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        'black-pearl': {
          50: '#ecfaff',
          100: '#d0effd',
          200: '#a7dffa',
          300: '#6bc7f5',
          400: '#27a5e9',
          500: '#0b88cf',
          600: '#0c6bae',
          700: '#11578d',
          800: '#174973',
          900: '#183d61',
          950: '#02080e',
        },
      },
      fontFamily: {
        default: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
