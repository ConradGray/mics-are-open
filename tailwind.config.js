/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Rate card design language ──────────────────────────────
        // Remapping existing semantic names so all existing classes
        // auto-update without touching every JSX file.

        // "cream" → dark backgrounds
        cream: {
          50:  '#0D0D0D',   // page background
          100: '#111111',   // surface / card background
          200: '#222222',   // borders / dividers
        },

        // "clay" → lime green accent
        clay: {
          50:  'rgba(199,255,0,0.07)',   // subtle lime tint
          100: 'rgba(199,255,0,0.12)',
          200: 'rgba(199,255,0,0.22)',
          300: '#9dcc00',
          400: '#b8ee00',
          500: '#C7FF00',   // PRIMARY accent — was clay orange
          600: '#d6ff1a',   // hover / lighter lime
          700: '#e0ff4d',
        },

        // "ink" → off-white text scale
        ink: {
          400: '#555555',   // very muted
          500: '#777777',   // muted / secondary text (added)
          600: '#999999',   // secondary text
          800: '#F0F0F0',   // primary text — was dark ink
        },

        // "sage" → dark surface variants
        sage: {
          200: '#1a1a1a',
          400: '#242424',
          600: '#2e2e2e',
        },
      },

      fontFamily: {
        // Display / headings → Bebas Neue (all-caps, bold)
        display: ['"Bebas Neue"', '"Arial Black"', 'Impact', 'sans-serif'],
        // Body → Poppins (clean, modern)
        sans: ['"Poppins"', 'Arial', 'sans-serif'],
      },

      boxShadow: {
        soft: '0 2px 12px -2px rgba(0,0,0,0.5)',
        card: '0 8px 32px -8px rgba(0,0,0,0.6)',
        lime: '0 4px 20px -4px rgba(199,255,0,0.25)',
      },

      letterSpacing: {
        widest: '0.3em',
      },
    },
  },
  plugins: [],
};
