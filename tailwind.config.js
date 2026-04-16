/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm community palette — cozy living room vibe
        cream: {
          50: '#fdfaf4',
          100: '#faf3e7',
          200: '#f3e5cc',
        },
        clay: {
          50: '#fbf1ec',
          100: '#f3dccf',
          200: '#e8b79e',
          300: '#d88c6a',
          400: '#c96a44',
          500: '#b45132', // primary warm accent
          600: '#953f27',
          700: '#733021',
        },
        ink: {
          400: '#6b5b4d',
          600: '#40362d',
          800: '#221d17', // primary text
        },
        sage: {
          200: '#cfd8c6',
          400: '#8aa17f',
          600: '#566a4e',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(64, 54, 45, 0.12)',
        card: '0 10px 30px -15px rgba(64, 54, 45, 0.2)',
      },
    },
  },
  plugins: [],
};
